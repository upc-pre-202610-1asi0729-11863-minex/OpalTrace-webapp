import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthMockUser,
  Segment,
  PlanTier,
} from '../../shared/infrastructure/auth.mock';

interface SignInResponse {
  id: number;
  email: string;
  fullName: string;
  companyName: string;
  segment: Segment;
  role: 'SUPERVISOR' | 'ADMIN' | 'CONSUMER';
  planTier: PlanTier;
  token: string;
}

interface RegisterEnterpriseBody {
  email: string;
  password: string;
  companyName: string;
  ruc: string;
  segment: Segment;
}

interface RegisterConsumerBody {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly currentUserSignal = signal<AuthMockUser | null>(null);
  private readonly isSignedInSignal  = signal<boolean>(false);

  readonly isSignedIn  = this.isSignedInSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly currentSegment = computed(() => this.currentUserSignal()?.segment ?? null);
  readonly currentPlan    = computed(() => this.currentUserSignal()?.planTier ?? null);
  readonly currentToken   = computed(() => this.isSignedIn() ? localStorage.getItem('ot_token') : null);

  readonly fullName = computed(() => {
    const u = this.currentUserSignal();
    if (!u) return '';
    const composed = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
    return u.fullName?.trim() || composed || u.companyName?.trim() || u.email || '';
  });

  readonly avatarInitials = computed(() => {
    const name = this.fullName().trim();
    if (!name) return 'OT';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0]?.slice(0, 2) || 'OT').toUpperCase();
  });

  readonly greetingKey = computed(() => {
    const u = this.currentUserSignal();
    return u?.gender === 'F' ? 'dashboard.welcome-f' : 'dashboard.welcome';
  });

  readonly greetingName = computed(() => {
    const u = this.currentUserSignal();
    if (!u) return '';
    return (u.segment === 'MINING' || u.segment === 'JEWELRY')
      ? (u.companyName || (u.fullName ?? u.firstName))
      : (u.fullName ?? u.firstName);
  });

  readonly isPlatinum    = computed(() => this.currentPlan() === 'PLATINUM');
  readonly isGoldOrAbove = computed(() => ['GOLD', 'PLATINUM'].includes(this.currentPlan() ?? ''));

  private readonly signInUrl            = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSignInEndpointPath}`;
  private readonly registerEnterpriseUrl = `${environment.platformProviderApiBaseUrl}/users/register/enterprise`;
  private readonly registerConsumerUrl   = `${environment.platformProviderApiBaseUrl}/users/register/consumer`;
  private readonly forgotPasswordUrl     = `${environment.platformProviderApiBaseUrl}${environment.platformProviderForgotPasswordEndpointPath}`;
  private readonly resetPasswordUrl      = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResetPasswordEndpointPath}`;
  private readonly changePasswordUrl     = (userId: number) => `${environment.platformProviderApiBaseUrl}/users/${userId}/password`;

  constructor(private readonly http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token    = localStorage.getItem('ot_token');
    const userData = localStorage.getItem('ot_user');
    if (token && userData) {
      try {
        const user: AuthMockUser = JSON.parse(userData);
        this.currentUserSignal.set(user);
        this.isSignedInSignal.set(true);
      } catch { /* ignore */ }
    }
  }

  private persist(user: AuthMockUser): void {
    localStorage.setItem('ot_token', user.token);
    localStorage.setItem('ot_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    this.isSignedInSignal.set(true);
  }

  private mapResponse(res: SignInResponse): AuthMockUser {
    const parts = res.fullName?.trim().split(' ') ?? ['', ''];
    return {
      id:          res.id,
      username:    res.email,
      email:       res.email,
      token:       res.token,
      segment:     res.segment,
      role:        res.role,
      planTier:    res.planTier,
      companyName: res.companyName ?? '',
      ruc:         '',
      firstName:   parts[0] ?? '',
      lastName:    parts.slice(1).join(' ') ?? '',
      fullName:    res.fullName,
      gender:      'M',
    };
  }

  loginAndNavigate(email: string, password: string, router: Router): Observable<{ error: string | null; lockout: boolean }> {
    return this.http.post<SignInResponse>(this.signInUrl, { email, password }).pipe(
      tap(res => {
        const user = this.mapResponse(res);
        this.persist(user);
        const seg = user.segment;
        if (seg === 'MINING')       router.navigate(['/mineral/dashboard']);
        else if (seg === 'JEWELRY') router.navigate(['/jewelry/dashboard']);
        else                        router.navigate(['/verify']);
      }),
      map(() => ({ error: null, lockout: false })),
      catchError(err => {
        const status = err.status as number;
        if (status === 423) return of({ error: 'auth.lockout', lockout: true });
        if (status === 401 || status === 403) return of({ error: 'auth.error-credentials', lockout: false });
        return of({ error: 'auth.error-connection', lockout: false });
      })
    );
  }

  completeOnboarding(
    data: { segment: Segment; planTier: PlanTier; email: string; ruc: string; companyName: string; firstName: string; lastName: string; gender?: 'M' | 'F'; password?: string },
    router: Router
  ): Observable<{ error: string | null }> {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const password = data.password ?? '';

    const register$: Observable<unknown> = data.segment === 'CONSUMER'
      ? this.http.post(this.registerConsumerUrl, {
          email:    data.email,
          password,
          fullName,
        } satisfies RegisterConsumerBody)
      : this.http.post(this.registerEnterpriseUrl, {
          email:       data.email,
          password,
          companyName: data.companyName,
          ruc:         data.ruc,
          segment:     data.segment,
        } satisfies RegisterEnterpriseBody);

    return register$.pipe(
      switchMap(() => this.http.post<SignInResponse>(this.signInUrl, { email: data.email, password })),
      tap(res => {
        const user = this.mapResponse(res);
        user.gender = data.gender ?? 'M';
        this.persist(user);
        if (data.segment === 'CONSUMER')      router.navigate(['/verify']);
        else if (data.segment === 'MINING')   router.navigate(['/mineral/dashboard']);
        else                                  router.navigate(['/jewelry/dashboard']);
      }),
      map(() => ({ error: null })),
      catchError(err => {
        const msg = err?.error?.message ?? 'auth.error-register';
        return of({ error: msg });
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string; resetToken: string }> {
    return this.http.post<{ message: string; resetToken: string }>(this.forgotPasswordUrl, { email }).pipe(
      catchError(() => of({ message: 'auth.error-forgot', resetToken: '' }))
    );
  }

  resetPassword(newPassword: string, token: string): Observable<{ success: boolean }> {
    return this.http.post<{ userId: number; success: boolean }>(this.resetPasswordUrl, { token, newPassword }).pipe(
      map(() => ({ success: true })),
      catchError(() => of({ success: false }))
    );
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<{ error: string | null }> {
    return this.http.put(this.changePasswordUrl(userId), { userId, currentPassword, newPassword }).pipe(
      map(() => ({ error: null })),
      catchError(err => {
        const msg = err?.error?.message ?? 'auth.error-change-password';
        return of({ error: msg });
      })
    );
  }

  logout(router: Router): void {
    localStorage.removeItem('ot_token');
    localStorage.removeItem('ot_user');
    this.currentUserSignal.set(null);
    this.isSignedInSignal.set(false);
    router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.isSignedInSignal();
  }

  upgradePlan(newPlan: PlanTier): void {
    const current = this.currentUserSignal();
    if (!current) return;
    const updated: AuthMockUser = { ...current, planTier: newPlan };
    this.persist(updated);
  }
}
