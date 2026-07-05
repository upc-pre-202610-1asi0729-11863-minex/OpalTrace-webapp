import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw   = group.get('newPassword')?.value ?? '';
  const conf = group.get('confirmPassword')?.value ?? '';
  return pw !== conf ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  private store  = inject(IamStore);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  success      = signal(false);
  tokenExpired = signal(false);
  private resetToken = '';

  form = new FormGroup({
    newPassword:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: matchPasswords });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.tokenExpired.set(true);
      return;
    }
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
