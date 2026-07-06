import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

export interface BillingData {
  cardHolder:  string;
  cardNumber:  string;
  expiryMonth: string;
  expiryYear:  string;
  cvv:         string;
}

function matchPasswords(ctrl: AbstractControl) {
  const np = ctrl.get('newPassword')?.value;
  const cp = ctrl.get('confirmPassword')?.value;
  return np && cp && np !== cp ? { mismatch: true } : null;
}

@Component({
  selector: 'app-profile-panel',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './profile-panel.html',
  styleUrl:    './profile-panel.css',
})
export class ProfilePanel implements OnInit {
  store     = inject(IamStore);
  private fb        = inject(FormBuilder);
  private translate = inject(TranslateService);

  close = output<void>();

  readonly isEnterprise = computed(() => {
    const seg = this.store.currentSegment();
    return seg === 'MINING' || seg === 'JEWELRY';
  });

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  billingForm!:  FormGroup;

  profileSaved  = signal(false);
  profileError  = signal<string | null>(null);
  passwordSaved = signal(false);
  passwordError = signal<string | null>(null);
  billingSaved  = signal(false);
  showCvv       = signal(false);
  showNewPw     = signal(false);
  showCurPw     = signal(false);

  readonly savedBilling = signal<BillingData | null>(null);

  readonly months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  readonly years  = Array.from({ length: 12 }, (_, i) => String(2026 + i));

  ngOnInit(): void {
    const u    = this.store.currentUser();
    const isEnt = this.isEnterprise();

    this.profileForm = this.fb.group({
      firstName:   [{ value: u?.firstName   ?? '', disabled: false }, [Validators.required]],
      lastName:    [{ value: u?.lastName    ?? '', disabled: false }, [Validators.required]],
      gender:      [u?.gender ?? null],
      email:       [{ value: u?.email       ?? '', disabled: false }, [Validators.required, Validators.email]],
      companyName: [{ value: u?.companyName ?? '', disabled: isEnt }],
      ruc:         [{ value: u?.ruc         ?? '', disabled: isEnt }],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: matchPasswords });

    const billing = this.loadBilling();
    this.savedBilling.set(billing);
    this.billingForm = this.fb.group({
      cardHolder:  [billing?.cardHolder  ?? ''],
      cardNumber:  [billing?.cardNumber  ?? ''],
      expiryMonth: [billing?.expiryMonth ?? ''],
      expiryYear:  [billing?.expiryYear  ?? ''],
      cvv:         [billing?.cvv         ?? ''],
    });
  }

  private loadBilling(): BillingData | null {
    const uid = this.store.currentUser()?.id;
    if (!uid) return null;
    try {
      const raw = localStorage.getItem(`ot_billing_${uid}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  cardBrand(num: string): string {
    const n = num.replace(/\s/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (n.startsWith('5')) return 'MASTERCARD';
    if (n.startsWith('3')) return 'AMEX';
    return 'CARD';
  }

  maskedNumber(num: string): string {
    const digits = num.replace(/\s/g, '');
    if (digits.length < 4) return num;
    return `**** **** **** ${digits.slice(-4)}`;
  }

  formatCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
    input.value = formatted;
    this.billingForm.get('cardNumber')!.setValue(formatted, { emitEvent: false });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.profileError.set(null);
    const v = this.profileForm.getRawValue();
    this.store.updateProfile({
      firstName: v.firstName,
      lastName:  v.lastName,
      gender:    v.gender,
      email:     v.email,
    });
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  savePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.passwordError.set(null);
    const v   = this.passwordForm.getRawValue();
    const uid = this.store.currentUser()?.id;
    if (!uid) return;
    this.store.changePassword(uid, v.currentPassword, v.newPassword).subscribe(res => {
      if (res.error) {
        this.passwordError.set(this.translate.instant(res.error));
      } else {
        this.passwordSaved.set(true);
        this.passwordForm.reset();
        setTimeout(() => this.passwordSaved.set(false), 3000);
      }
    });
  }

  saveBilling(): void {
    const uid = this.store.currentUser()?.id;
    if (!uid) return;
    const v = this.billingForm.getRawValue() as BillingData;
    localStorage.setItem(`ot_billing_${uid}`, JSON.stringify(v));
    this.savedBilling.set(v);
    this.billingSaved.set(true);
    setTimeout(() => this.billingSaved.set(false), 3000);
  }

  fieldErr(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
