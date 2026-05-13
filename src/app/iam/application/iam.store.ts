import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthMockUser,
  AUTH_MOCK_MINING_GOLD,
  AUTH_MOCK_MINING_PLATINUM,
  AUTH_MOCK_MINING_PLATINUM_ROBERTO,
  AUTH_MOCK_JEWELRY_GOLD,
  AUTH_MOCK_JEWELRY_GOLD_SOFIA,
  AUTH_MOCK_CONSUMER,
  AUTH_MOCK_CONSUMER_LUIS,
  Segment,
  PlanTier,
} from '../../shared/infrastructure/auth.mock';

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly currentUserSignal = signal<AuthMockUser | null>(null);
  private readonly isSignedInSignal = signal<boolean>(false);
  private failedAttempts = 0;

  readonly isSignedIn  = this.isSignedInSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly currentSegment = computed(() => this.currentUserSignal()?.segment ?? null);
  readonly currentPlan    = computed(() => this.currentUserSignal()?.planTier ?? null);
  readonly currentToken   = computed(() => this.isSignedIn() ? localStorage.getItem('ot_token') : null);

  readonly fullName = computed(() => {
    const u = this.currentUserSignal();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  readonly avatarInitials = computed(() => {
    const u = this.currentUserSignal();
    return u ? `${u.firstName[0]}${u.lastName[0]}` : 'OT';
  });

  readonly greetingKey = computed(() => {
    const u = this.currentUserSignal();
    return u?.gender === 'F' ? 'dashboard.welcome-f' : 'dashboard.welcome';
  });

  readonly greetingName = computed(() => {
    const u = this.currentUserSignal();
    if (!u) return '';
    return (u.segment === 'MINING' || u.segment === 'JEWELRY')
      ? (u.companyName || u.firstName)
      : u.firstName;
  });

  readonly isPlatinum = computed(() => this.currentPlan() === 'PLATINUM');
  readonly isGoldOrAbove = computed(() => ['GOLD', 'PLATINUM'].includes(this.currentPlan() ?? ''));

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    const token = localStorage.getItem('ot_token');
    const userData = localStorage.getItem('ot_user');
    if (token && userData) {
      try {
        const user: AuthMockUser = JSON.parse(userData);
        this.currentUserSignal.set(user);
        this.isSignedInSignal.set(true);
      } catch { /* ignore */ }
    }
  }

  private persist(user: AuthMockUser) {
    localStorage.setItem('ot_token', user.token);
    localStorage.setItem('ot_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    this.isSignedInSignal.set(true);
    this.failedAttempts = 0;
  }

  /** Mock login — returns error code or null on success */
  login(email: string, _password: string): { error: string | null; lockout: boolean } {
    this.failedAttempts++;
    if (this.failedAttempts >= 5) return { error: 'Cuenta bloqueada temporalmente (15 min)', lockout: true };

    const mockUsers: Record<string, AuthMockUser> = {
      'mario.vargas@minassur.com':        AUTH_MOCK_MINING_GOLD,
      'platinum@minassur.com':             AUTH_MOCK_MINING_PLATINUM,
      'roberto.quispe@minassur.com':       AUTH_MOCK_MINING_PLATINUM_ROBERTO,
      'carmen.lopez@joyeriaelite.com':    AUTH_MOCK_JEWELRY_GOLD,
      'sofia.mamani@artesaniassur.com':   AUTH_MOCK_JEWELRY_GOLD_SOFIA,
      'ana.perez@gmail.com':              AUTH_MOCK_CONSUMER,
      'luis.flores@gmail.com':            AUTH_MOCK_CONSUMER_LUIS,
    };

    const registered: Record<string, AuthMockUser> =
      JSON.parse(localStorage.getItem('ot_registered') ?? '{}');

    const emailLower = email.toLowerCase();
    const user = mockUsers[emailLower] ?? registered[emailLower];
    if (!user) return { error: 'Credenciales incorrectas. Verifique su correo y contraseña.', lockout: false };

    if (registered[emailLower] && user.password && user.password !== _password) {
      return { error: 'Credenciales incorrectas. Verifique su correo y contraseña.', lockout: false };
    }

    this.persist(user);
    return { error: null, lockout: false };
  }

  loginAndNavigate(email: string, password: string, router: Router): { error: string | null; lockout: boolean } {
    const result = this.login(email, password);
    if (!result.error) {
      const seg = this.currentSegment();
      if (seg === 'MINING')       router.navigate(['/mineral/dashboard']);
      else if (seg === 'JEWELRY') router.navigate(['/jewelry/dashboard']);
      else                        router.navigate(['/verify']);
    }
    return result;
  }

  /** Mock register — always succeeds */
  register(_data: { companyName: string; ruc: string; email: string; password: string; segment: Segment }) {
    return { success: true, error: null };
  }

  /** Complete onboarding after register */
  completeOnboarding(data: { segment: Segment; planTier: PlanTier; ruc: string; companyName: string; firstName: string; lastName: string; gender?: 'M' | 'F'; password?: string }, router: Router) {
    const mockMap: Record<string, AuthMockUser> = {
      'MINING_GOLD':      AUTH_MOCK_MINING_GOLD,
      'MINING_PLATINUM':  AUTH_MOCK_MINING_PLATINUM,
      'JEWELRY_GOLD':     AUTH_MOCK_JEWELRY_GOLD,
      'JEWELRY_PLATINUM': { ...AUTH_MOCK_JEWELRY_GOLD, planTier: 'PLATINUM', token: 'mock-jwt-jewelry-platinum' },
      'CONSUMER_SILVER':  AUTH_MOCK_CONSUMER,
    };
    const key = `${data.segment}_${data.planTier}`;
    const user = mockMap[key] ?? AUTH_MOCK_MINING_GOLD;
    const customUser: AuthMockUser = {
      ...user,
      firstName:   data.firstName || user.firstName,
      lastName:    data.lastName  || user.lastName,
      companyName: data.companyName,
      ruc:         data.ruc,
      gender:      data.gender ?? user.gender,
      password:    data.password,
    };

    const registered: Record<string, AuthMockUser> =
      JSON.parse(localStorage.getItem('ot_registered') ?? '{}');
    registered[customUser.email.toLowerCase()] = customUser;
    localStorage.setItem('ot_registered', JSON.stringify(registered));

    this.persist(customUser);
    if (data.segment === 'CONSUMER')      router.navigate(['/verify']);
    else if (data.segment === 'MINING')   router.navigate(['/mineral/dashboard']);
    else                                  router.navigate(['/jewelry/dashboard']);
  }

  forgotPassword(_email: string) {
    return { sent: true };
  }

  resetPassword(_newPassword: string, _token: string) {
    return { success: true };
  }

  logout(router: Router) {
    localStorage.removeItem('ot_token');
    localStorage.removeItem('ot_user');
    this.currentUserSignal.set(null);
    this.isSignedInSignal.set(false);
    this.failedAttempts = 0;
    router.navigate(['/auth/login']);
  }

  /** Used by guard */
  isAuthenticated(): boolean {
    return this.isSignedInSignal();
  }

  /** Upgrade plan in mock */
  upgradePlan(newPlan: PlanTier) {
    const current = this.currentUserSignal();
    if (!current) return;
    const updated: AuthMockUser = { ...current, planTier: newPlan };
    this.persist(updated);
  }
}