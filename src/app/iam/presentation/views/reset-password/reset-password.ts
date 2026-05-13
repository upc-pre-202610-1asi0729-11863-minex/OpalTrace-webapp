import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamStore } from '../../../application/iam.store';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('newPassword')?.value ?? '';
  const conf = group.get('confirmPassword')?.value ?? '';
  return pw !== conf ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private store = inject(IamStore);
  private router = inject(Router);
  success = signal(false);
  tokenExpired = signal(false);

  form = new FormGroup({
    newPassword:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: matchPasswords });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.store.resetPassword(this.form.getRawValue().newPassword, 'mock-token');
    this.success.set(true);
    setTimeout(() => this.router.navigate(['/auth/login']), 2000);
  }
}
