import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';

const PW_COMMON = ['password','123456','qwerty','abc123','letmein','admin','welcome','monkey','dragon','master','iloveyou','sunshine','princess','football','baseball','superman','batman','trustno1','shadow','michael','password1','contraseña','hola1234','clave123'];

function hasSequence(p: string): boolean {
  for (let i = 0; i < p.length - 2; i++) {
    const a = p.charCodeAt(i), b = p.charCodeAt(i + 1), c = p.charCodeAt(i + 2);
    if (b === a + 1 && c === a + 2) return true;
    if (b === a - 1 && c === a - 2) return true;
  }
  return false;
}

const PW_LEVELS = [
  { labelKey: 'onboarding.pw-very-weak',   color: '#E24B4A' },
  { labelKey: 'onboarding.pw-weak',        color: '#EF9F27' },
  { labelKey: 'onboarding.pw-medium',      color: '#CEAA1A' },
  { labelKey: 'onboarding.pw-good',        color: '#639922' },
  { labelKey: 'onboarding.pw-very-strong', color: '#1D9E75' },
];

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw   = group.get('newPassword')?.value ?? '';
  const conf = group.get('confirmPassword')?.value ?? '';
  return pw !== conf ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private store  = inject(IamStore);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  success      = signal(false);
  tokenExpired = signal(false);
  private resetToken = '';

  readonly pwSegs = [1, 2, 3, 4, 5];

  form = new FormGroup({
    newPassword:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: matchPasswords });

  get pw() {
    const p = this.form.get('newPassword')?.value ?? '';
    const len    = p.length >= 8;
    const upper  = /[A-Z]/.test(p);
    const lower  = /[a-z]/.test(p);
    const num    = /[0-9]/.test(p);
    const sym    = /[^A-Za-z0-9]/.test(p);
    const long   = p.length >= 13;
    const noSeq  = !hasSequence(p);
    const noRep  = !/(.)\1{2,}/.test(p);
    const noComm = !PW_COMMON.includes(p.toLowerCase());
    const noSpc  = !/\s/.test(p);

    let score = 0;
    if (p.length > 0) {
      score = 1;
      if (len) score++;
      if (upper && lower) score++;
      if (num) score++;
      if (sym) score++;
      if (long) score++;
      if (!noSeq || !noRep || !noComm) score = Math.max(1, score - 1);
      score = Math.min(5, score);
    }

    const lv = score > 0 ? PW_LEVELS[score - 1] : { labelKey: '', color: '#ccc' };

    let tipKey = '';
    if (p.length > 0) {
      if (!len)               tipKey = 'onboarding.pw-tip-len';
      else if (!upper || !lower) tipKey = 'onboarding.pw-tip-case';
      else if (!num)          tipKey = 'onboarding.pw-tip-num';
      else if (!sym)          tipKey = 'onboarding.pw-tip-sym';
      else if (!long)         tipKey = 'onboarding.pw-tip-long';
      else if (score >= 5)    tipKey = 'onboarding.pw-tip-excellent';
      else                    tipKey = 'onboarding.pw-tip-improve';
    }

    return { score, labelKey: lv.labelKey, color: lv.color, tipKey, len, upper, lower, num, sym, long, noSeq, noRep, noComm, noSpc };
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) { this.tokenExpired.set(true); return; }
    this.resetToken = token;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.store.resetPassword(this.form.getRawValue().newPassword, this.resetToken).subscribe(res => {
      if (res.success) {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      } else {
        this.tokenExpired.set(true);
      }
    });
  }
}
