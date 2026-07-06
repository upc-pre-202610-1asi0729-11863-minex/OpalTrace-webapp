import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, LanguageSwitcher],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private store = inject(IamStore);
  private doc   = inject(DOCUMENT);
  sent       = signal(false);
  emailError = signal<string | null>(null);
  resetLink  = signal<string | null>(null);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.emailError.set(null);
    this.store.forgotPassword(this.form.getRawValue().email).subscribe(res => {
      if (res.error) { this.emailError.set(res.error); return; }
      this.sent.set(true);
      if (res.resetToken) {
        const base = this.doc.baseURI.replace(/\/$/, '');
        this.resetLink.set(`${base}/auth/reset-password?token=${res.resetToken}`);
      }
    });
  }
}
