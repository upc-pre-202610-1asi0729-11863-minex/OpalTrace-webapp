import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import type { PlanTier, Segment } from '../../../../shared/infrastructure/auth.mock';

type Profile = 'MINING' | 'JEWELRY' | 'CONSUMER';

const PW_COMMON = ['password','123456','qwerty','abc123','letmein','admin','welcome','monkey','dragon','master','iloveyou','sunshine','princess','football','baseball','superman','batman','trustno1','shadow','michael','password1','contraseña','hola1234','clave123'];

function hasSequence(p: string): boolean {
  for (let i = 0; i < p.length - 2; i++) {
    const a = p.charCodeAt(i), b = p.charCodeAt(i + 1), c = p.charCodeAt(i + 2);
    if (b === a + 1 && c === a + 2) return true;
    if (b === a - 1 && c === a - 2) return true;
  }
  return false;
}

function matchPasswords(g: AbstractControl): ValidationErrors | null {
  const pw  = g.get('password')?.value ?? '';
  const cfg = g.get('confirmPassword')?.value ?? '';
  return pw === cfg ? null : { mismatch: true };
}

function expiryValidator(c: AbstractControl): ValidationErrors | null {
  const val = (c.value as string ?? '').trim();
  if (!val) return null;
  const match = val.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return { expiryFormat: true };
  const month = parseInt(match[1], 10);
  const year  = parseInt(match[2], 10);
  if (year < 26) return { expiryExpired: true };
  if (year === 26 && month < 5) return { expiryExpired: true };
  return null;
}

function visaMastercard(c: AbstractControl): ValidationErrors | null {
  const raw = (c.value as string ?? '').replace(/\s+/g, '');
  if (!raw) return null;
  const visa       = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const mastercard = /^5[1-5][0-9]{14}$|^2(?:2[2-9][1-9]|[3-6][0-9]{2}|7[01][0-9]|720)[0-9]{12}$/;
  return visa.test(raw) || mastercard.test(raw) ? null : { invalidCard: true };
}

// ─── Business email domains ──────────────────────────────────────────────────
const HOTMAIL_DOMAINS = ['hotmail.com','hotmail.es','hotmail.co.uk','hotmail.fr','hotmail.it','hotmail.de','live.com','live.es','live.co.uk','live.fr','msn.com'];
const OUTLOOK_DOMAINS = ['outlook.com','outlook.es','outlook.co.uk','outlook.fr','outlook.it','outlook.de'];
const YAHOO_DOMAINS   = ['yahoo.com','yahoo.es','yahoo.co.uk','yahoo.fr','yahoo.com.mx','yahoo.com.ar'];
const BIZ_TLDS        = ['com','org','pe'];

function businessEmailValidator(c: AbstractControl): ValidationErrors | null {
  const val = (c.value as string ?? '').trim();
  if (!val) return null;
  const parts = val.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { emailErr: 'onboarding.err-email-no-at' };
  const user = parts[0];
  const domain = parts[1].toLowerCase();
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(user) || user.startsWith('.') || user.endsWith('.'))
    return { emailErr: 'onboarding.err-email-user' };
  const dp = domain.split('.');
  if (dp.length < 2 || dp[0].length < 2 || !/^[a-zA-Z0-9\-]+$/.test(dp[0]))
    return { emailErr: 'onboarding.err-email-domain' };
  const tld = dp[dp.length - 1];
  if (!BIZ_TLDS.includes(tld)) return { emailErr: 'onboarding.err-email-tld-biz' };
  if (['gmail.com','googlemail.com'].includes(domain)) return { emailErr: 'onboarding.err-email-gmail' };
  if (HOTMAIL_DOMAINS.includes(domain)) return { emailErr: 'onboarding.err-email-hotmail' };
  if (OUTLOOK_DOMAINS.includes(domain)) return { emailErr: 'onboarding.err-email-outlook' };
  if (YAHOO_DOMAINS.includes(domain)) return { emailErr: 'onboarding.err-email-yahoo' };
  return null;
}

// ─── Personal email domains ──────────────────────────────────────────────────
const PERSONAL_PROVIDERS: Record<string, string[]> = {
  Gmail:      ['gmail.com','googlemail.com'],
  Hotmail:    HOTMAIL_DOMAINS,
  Outlook:    OUTLOOK_DOMAINS,
  Yahoo:      YAHOO_DOMAINS,
  iCloud:     ['icloud.com','me.com','mac.com'],
  ProtonMail: ['protonmail.com','protonmail.ch','pm.me'],
  Zoho:       ['zoho.com','zohomail.com'],
  GMX:        ['gmx.com','gmx.net','gmx.de'],
  AOL:        ['aol.com','aim.com'],
  Yandex:     ['yandex.com','yandex.ru'],
};

function findPersonalProvider(domain: string): string | null {
  for (const [name, domains] of Object.entries(PERSONAL_PROVIDERS)) {
    if (domains.includes(domain)) return name;
  }
  return null;
}

function personalEmailValidator(c: AbstractControl): ValidationErrors | null {
  const val = (c.value as string ?? '').trim();
  if (!val) return null;
  const parts = val.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { emailErr: 'onboarding.err-email-no-at' };
  const user = parts[0];
  const domain = parts[1].toLowerCase();
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(user) || user.startsWith('.') || user.endsWith('.'))
    return { emailErr: 'onboarding.err-email-user' };
  const dp = domain.split('.');
  if (dp.length < 2 || dp[0].length < 2 || !/^[a-zA-Z0-9\-]+$/.test(dp[0]))
    return { emailErr: 'onboarding.err-email-domain' };
  const tld = dp[dp.length - 1];
  if (tld !== 'com') return { emailErr: 'onboarding.err-email-tld-pers' };
  if (!findPersonalProvider(domain)) return { emailErr: 'onboarding.err-email-unknown' };
  return null;
}

// ─── Password levels (i18n keys) ─────────────────────────────────────────────
const PW_LEVELS = [
  { labelKey: 'onboarding.pw-very-weak',  color: '#E24B4A' },
  { labelKey: 'onboarding.pw-weak',       color: '#EF9F27' },
  { labelKey: 'onboarding.pw-medium',     color: '#CEAA1A' },
  { labelKey: 'onboarding.pw-good',       color: '#639922' },
  { labelKey: 'onboarding.pw-very-strong',color: '#1D9E75' },
];

interface PlanOption { id: PlanTier; nameKey: string; price: number; featureKeys: string[]; }

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule, RouterLink, LanguageSwitcher, TranslatePipe],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding implements OnInit {
  private store     = inject(IamStore);
  private router    = inject(Router);
  private route     = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  step            = signal<1 | 2 | 3 | 4>(1);
  selectedProfile = signal<Profile | null>(null);
  selectedPlan    = signal<PlanTier>('GOLD');
  pwVisible       = signal(false);

  ngOnInit(): void {
    const profile = this.route.snapshot.queryParamMap.get('profile') as Profile | null;
    if (profile === 'MINING' || profile === 'JEWELRY') {
      this.selectProfile(profile);
      this.continueToStep2();
    }
  }

  togglePwVisible() { this.pwVisible.update(v => !v); }

  readonly profiles: { id: Profile; titleKey: string; descKey: string; icon: string; infoKey: string }[] = [
    {
      id: 'MINING',
      titleKey: 'onboarding.profile-mining-title',
      descKey:  'onboarding.profile-mining-desc',
      icon: 'ti-building-factory-2',
      infoKey:  'onboarding.profile-mining-info',
    },
    {
      id: 'JEWELRY',
      titleKey: 'onboarding.profile-jewelry-title',
      descKey:  'onboarding.profile-jewelry-desc',
      icon: 'ti-diamond',
      infoKey:  'onboarding.profile-jewelry-info',
    },
    {
      id: 'CONSUMER',
      titleKey: 'onboarding.profile-consumer-title',
      descKey:  'onboarding.profile-consumer-desc',
      icon: 'ti-user-scan',
      infoKey:  'onboarding.profile-consumer-info',
    },
  ];

  readonly isBusiness = computed(() => {
    const p = this.selectedProfile();
    return p === 'MINING' || p === 'JEWELRY';
  });

  readonly selectedInfo = computed(() =>
    this.profiles.find(p => p.id === this.selectedProfile()) ?? null
  );

  dataForm = new FormGroup({
    firstName:       new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gender:          new FormControl<'M' | 'F' | null>(null, { validators: [Validators.required] }),
    email:           new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    companyName:     new FormControl('', { nonNullable: true }),
    ruc:             new FormControl('', { nonNullable: true }),
    password:        new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    terms:           new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  }, { validators: matchPasswords });

  paymentForm = new FormGroup({
    cardName:   new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cardNumber: new FormControl('', { nonNullable: true, validators: [Validators.required, visaMastercard] }),
    expiry:     new FormControl('', { nonNullable: true, validators: [Validators.required, expiryValidator] }),
    cvv:        new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{3,4}$/)] }),
  });

  readonly plans = computed<PlanOption[]>(() => {
    const p = this.selectedProfile();
    if (p === 'CONSUMER') {
      return [{
        id: 'SILVER',
        nameKey: 'onboarding.plan-silver-name',
        price: 15,
        featureKeys: ['onboarding.plan-silver-f1','onboarding.plan-silver-f2','onboarding.plan-silver-f3'],
      }];
    }
    const isMining = p === 'MINING';
    return [
      {
        id: 'GOLD',
        nameKey: isMining ? 'onboarding.plan-gold-mining' : 'onboarding.plan-gold-jewelry',
        price: 79,
        featureKeys: isMining
          ? ['onboarding.plan-mining-gold-f1','onboarding.plan-mining-gold-f2','onboarding.plan-mining-gold-f3','onboarding.plan-mining-gold-f4']
          : ['onboarding.plan-jewelry-gold-f1','onboarding.plan-jewelry-gold-f2','onboarding.plan-jewelry-gold-f3','onboarding.plan-jewelry-gold-f4'],
      },
      {
        id: 'PLATINUM',
        nameKey: isMining ? 'onboarding.plan-platinum-mining' : 'onboarding.plan-platinum-jewelry',
        price: 149,
        featureKeys: isMining
          ? ['onboarding.plan-mining-plat-f1','onboarding.plan-mining-plat-f2','onboarding.plan-mining-plat-f3','onboarding.plan-mining-plat-f4']
          : ['onboarding.plan-jewelry-plat-f1','onboarding.plan-jewelry-plat-f2','onboarding.plan-jewelry-plat-f3','onboarding.plan-jewelry-plat-f4'],
      },
    ];
  });

  get pw() {
    const p = this.dataForm.get('password')?.value ?? '';
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
      if (!len)              tipKey = 'onboarding.pw-tip-len';
      else if (!upper || !lower) tipKey = 'onboarding.pw-tip-case';
      else if (!num)         tipKey = 'onboarding.pw-tip-num';
      else if (!sym)         tipKey = 'onboarding.pw-tip-sym';
      else if (!long)        tipKey = 'onboarding.pw-tip-long';
      else if (score >= 5)   tipKey = 'onboarding.pw-tip-excellent';
      else                   tipKey = 'onboarding.pw-tip-improve';
    }

    return { score, labelKey: lv.labelKey, color: lv.color, tipKey, len, upper, lower, num, sym, long, noSeq, noRep, noComm, noSpc };
  }

  readonly pwSegs = [1, 2, 3, 4, 5];

  get emailChecks(): { labelKey: string; ok: boolean }[] {
    const val = (this.dataForm.get('email')?.value ?? '').trim();
    const profile = this.selectedProfile();
    if (!val || !profile) return [];
    const parts = val.split('@');
    const hasAt = parts.length === 2 && !!parts[0] && !!parts[1];
    const user   = hasAt ? parts[0] : '';
    const domain = hasAt ? parts[1].toLowerCase() : '';
    const dp     = domain.split('.');
    const tld    = dp.length >= 2 ? dp[dp.length - 1] : '';
    const validUser   = hasAt && /^[a-zA-Z0-9._%+\-]+$/.test(user) && !user.startsWith('.') && !user.endsWith('.');
    const validDomain = hasAt && dp.length >= 2 && dp[0].length >= 2 && /^[a-zA-Z0-9\-]+$/.test(dp[0]);

    if (profile === 'CONSUMER') {
      return [
        { labelKey: 'onboarding.email-rule-at',       ok: hasAt },
        { labelKey: 'onboarding.email-rule-user',     ok: validUser },
        { labelKey: 'onboarding.email-rule-domain',   ok: validDomain },
        { labelKey: 'onboarding.email-rule-tld-pers', ok: hasAt && tld === 'com' },
        { labelKey: 'onboarding.email-rule-provider', ok: hasAt && !!findPersonalProvider(domain) },
      ];
    }
    return [
      { labelKey: 'onboarding.email-rule-at',          ok: hasAt },
      { labelKey: 'onboarding.email-rule-user',        ok: validUser },
      { labelKey: 'onboarding.email-rule-domain',      ok: validDomain },
      { labelKey: 'onboarding.email-rule-tld-biz',     ok: hasAt && BIZ_TLDS.includes(tld) },
      { labelKey: 'onboarding.email-rule-not-gmail',   ok: hasAt && !['gmail.com','googlemail.com'].includes(domain) },
      { labelKey: 'onboarding.email-rule-not-hotmail', ok: hasAt && !HOTMAIL_DOMAINS.includes(domain) },
      { labelKey: 'onboarding.email-rule-not-outlook', ok: hasAt && !OUTLOOK_DOMAINS.includes(domain) },
      { labelKey: 'onboarding.email-rule-not-yahoo',   ok: hasAt && !YAHOO_DOMAINS.includes(domain) },
    ];
  }

  get emailCheckGroups(): { col1Key: string; col1: { labelKey: string; ok: boolean }[]; col2Key: string; col2: { labelKey: string; ok: boolean }[] } | null {
    const val = (this.dataForm.get('email')?.value ?? '').trim();
    const profile = this.selectedProfile();
    if (!val || !profile) return null;
    const parts = val.split('@');
    const hasAt = parts.length === 2 && !!parts[0] && !!parts[1];
    const user   = hasAt ? parts[0] : '';
    const domain = hasAt ? parts[1].toLowerCase() : '';
    const dp     = domain.split('.');
    const tld    = dp.length >= 2 ? dp[dp.length - 1] : '';
    const validUser   = hasAt && /^[a-zA-Z0-9._%+\-]+$/.test(user) && !user.startsWith('.') && !user.endsWith('.');
    const validDomain = hasAt && dp.length >= 2 && dp[0].length >= 2 && /^[a-zA-Z0-9\-]+$/.test(dp[0]);
    const isPersonal  = hasAt && !!findPersonalProvider(domain);

    if (profile === 'CONSUMER') {
      return {
        col1Key: 'onboarding.email-col-format',
        col1: [
          { labelKey: 'onboarding.email-rule-at',       ok: hasAt },
          { labelKey: 'onboarding.email-rule-user',     ok: validUser },
          { labelKey: 'onboarding.email-rule-domain',   ok: validDomain },
          { labelKey: 'onboarding.email-rule-tld-pers', ok: hasAt && tld === 'com' },
        ],
        col2Key: 'onboarding.email-col-pers-provider',
        col2: [
          { labelKey: 'onboarding.email-rule-provider', ok: isPersonal },
          { labelKey: 'onboarding.email-rule-not-corp', ok: isPersonal },
        ],
      };
    }
    return {
      col1Key: 'onboarding.email-col-format',
      col1: [
        { labelKey: 'onboarding.email-rule-at',      ok: hasAt },
        { labelKey: 'onboarding.email-rule-user',    ok: validUser },
        { labelKey: 'onboarding.email-rule-domain',  ok: validDomain },
        { labelKey: 'onboarding.email-rule-tld-biz', ok: hasAt && BIZ_TLDS.includes(tld) },
      ],
      col2Key: 'onboarding.email-col-biz-domain',
      col2: [
        { labelKey: 'onboarding.email-rule-not-gmail',   ok: hasAt && !['gmail.com','googlemail.com'].includes(domain) },
        { labelKey: 'onboarding.email-rule-not-hotmail', ok: hasAt && !HOTMAIL_DOMAINS.includes(domain) },
        { labelKey: 'onboarding.email-rule-not-outlook', ok: hasAt && !OUTLOOK_DOMAINS.includes(domain) },
        { labelKey: 'onboarding.email-rule-not-yahoo',   ok: hasAt && !YAHOO_DOMAINS.includes(domain) },
      ],
    };
  }

  get emailProvider(): string | null {
    if (this.selectedProfile() !== 'CONSUMER') return null;
    const val = (this.dataForm.get('email')?.value ?? '').trim();
    const parts = val.split('@');
    if (parts.length !== 2) return null;
    return findPersonalProvider(parts[1].toLowerCase());
  }

  selectProfile(p: Profile) {
    this.selectedProfile.set(p);
    this.selectedPlan.set(p === 'CONSUMER' ? 'SILVER' : 'GOLD');
  }

  selectPlan(id: PlanTier) { this.selectedPlan.set(id); }

  continueToStep2() {
    if (!this.selectedProfile()) return;
    const profile = this.selectedProfile()!;
    const isBiz   = profile === 'MINING' || profile === 'JEWELRY';
    const companyCtrl = this.dataForm.get('companyName')!;
    const rucCtrl     = this.dataForm.get('ruc')!;
    const emailCtrl   = this.dataForm.get('email')!;

    if (isBiz) {
      companyCtrl.setValidators([Validators.required]);
      rucCtrl.setValidators([Validators.required, Validators.pattern(/^20\d{9}$/)]);
      emailCtrl.setValidators([Validators.required, businessEmailValidator]);
    } else {
      companyCtrl.clearValidators();
      rucCtrl.clearValidators();
      emailCtrl.setValidators([Validators.required, personalEmailValidator]);
    }
    companyCtrl.updateValueAndValidity();
    rucCtrl.updateValueAndValidity();
    emailCtrl.updateValueAndValidity();
    this.step.set(2);
  }

  continueToStep3() {
    if (this.dataForm.invalid) { this.dataForm.markAllAsTouched(); return; }
    this.step.set(3);
  }

  continueToStep4() { this.step.set(4); }

  back() { this.step.update(s => (s > 1 ? (s - 1) as 1 | 2 | 3 | 4 : s)); }

  registerError = signal<string | null>(null);
  registerLoading = signal(false);

  confirm() {
    if (this.paymentForm.invalid) { this.paymentForm.markAllAsTouched(); return; }
    const profile  = this.selectedProfile()!;
    const segment: Segment = profile === 'CONSUMER' ? 'CONSUMER' : profile === 'MINING' ? 'MINING' : 'JEWELRY';
    const v = this.dataForm.getRawValue();
    this.registerLoading.set(true);
    this.registerError.set(null);
    this.store.completeOnboarding({
      segment,
      planTier:    this.selectedPlan(),
      email:       v.email,
      firstName:   v.firstName,
      lastName:    v.lastName,
      gender:      v.gender as 'M' | 'F',
      companyName: v.companyName,
      ruc:         v.ruc,
      password:    v.password,
    }, this.router).subscribe(result => {
      this.registerLoading.set(false);
      if (result.error) this.registerError.set(this.translate.instant(result.error));
    });
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
    input.value = val;
    this.paymentForm.get('expiry')!.setValue(val, { emitEvent: true });
  }

  fieldErr(form: FormGroup, name: string): boolean {
    const c = form.get(name);
    return !!(c?.invalid && c.touched);
  }
}
