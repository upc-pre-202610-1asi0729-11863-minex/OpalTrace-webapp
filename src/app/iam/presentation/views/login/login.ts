import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamStore } from '../../../application/iam.store';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LanguageSwitcher, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private store = inject(IamStore);
  private router = inject(Router);

  errorMsg  = signal<string | null>(null);
  isLockout = signal(false);
  loading   = signal(false);

  form = new FormGroup({
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);

    const { email, password } = this.form.getRawValue();
    this.store.loginAndNavigate(email, password, this.router).subscribe(result => {
      this.loading.set(false);
      if (result.lockout) {
        this.isLockout.set(true);
        this.errorMsg.set(result.error);
      } else if (result.error) {
        this.errorMsg.set(result.error);
      }
    });
  }

  get emailInvalid() { return this.form.get('email')?.invalid && this.form.get('email')?.touched; }
  get pwInvalid()    { return this.form.get('password')?.invalid && this.form.get('password')?.touched; }
}
