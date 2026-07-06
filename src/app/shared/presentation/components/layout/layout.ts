import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface NavItem    { icon: string; label: string; route: string; lock?: string; }
interface NavSection { label: string; items: NavItem[]; }

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, LanguageSwitcher, TranslatePipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  store     = inject(IamStore);
  translate = inject(TranslateService);
  private router = inject(Router);

  upgradeModal = signal(false);

  openUpgradeModal(item: NavItem, event: Event) {
    if (item.lock) {
      event.preventDefault();
      this.upgradeModal.set(true);
    }
  }

  goToSubscription() {
    this.upgradeModal.set(false);
    this.router.navigate(['/subscription']);
  }

  readonly navSections = computed<NavSection[]>(() => {
    const seg        = this.store.currentSegment();
    const isPlatinum = this.store.currentPlan() === 'PLATINUM';

    if (seg === 'MINING') {
      return [
        {
          label: 'nav.OPERACIONES',
          items: [
            { icon: 'ti-layout-dashboard', label: 'nav.dashboard',          route: '/mineral/dashboard' },
            { icon: 'ti-list',             label: 'nav.batches',        route: '/mineral/batches' },
            { icon: 'ti-plus',             label: 'nav.register-batch', route: '/mineral/register' },
            { icon: 'ti-truck',            label: 'nav.custody',        route: '/custody/transfer' },
            { icon: 'ti-map-pin',          label: 'nav.location',       route: '/custody/location' },
            { icon: 'ti-alert-triangle',   label: 'nav.anomalies',          route: '/mineral/alerts' },
            { icon: 'ti-building-factory', label: 'nav.refinery',           route: '/refinery/receive', lock: isPlatinum ? undefined : 'Platinum' },
            { icon: 'ti-refresh',          label: 'nav.sync',               route: '/mineral/sync' },
          ],
        },
        {
          label: 'nav.REPORTES',
          items: [
            { icon: 'ti-chart-line', label: 'nav.analytics', route: '/analytics/dashboard' },
            { icon: 'ti-leaf',       label: 'nav.esg',        route: '/analytics/esg',       lock: isPlatinum ? undefined : 'Platinum' },
          ],
        },
        {
          label: 'nav.CUENTA',
          items: [
            { icon: 'ti-credit-card', label: 'nav.subscription', route: '/subscription' },
          ],
        },
      ];
    }

    if (seg === 'JEWELRY') {
      return [
        {
          label: 'nav.OPERACIONES',
          items: [
            { icon: 'ti-layout-dashboard', label: 'nav.dashboard',         route: '/jewelry/dashboard' },
            { icon: 'ti-package',          label: 'nav.inventory',         route: '/jewelry/inventory' },
            { icon: 'ti-shield-check',     label: 'nav.receive-material',  route: '/jewelry/receive' },
            { icon: 'ti-package-import',   label: 'nav.external-material', route: '/jewelry/external', lock: isPlatinum ? undefined : 'Platinum' },
            { icon: 'ti-certificate',      label: 'nav.certify',           route: '/jewelry/certify' },
          ],
        },
        {
          label: 'nav.REPORTES',
          items: [
            { icon: 'ti-chart-line', label: 'nav.analytics', route: '/analytics/dashboard' },
            { icon: 'ti-leaf',       label: 'nav.esg',        route: '/analytics/esg',       lock: isPlatinum ? undefined : 'Platinum' },
          ],
        },
        {
          label: 'nav.CUENTA',
          items: [
            { icon: 'ti-credit-card', label: 'nav.subscription', route: '/subscription' },
          ],
        },
      ];
    }

    // CONSUMER
    return [
      {
        label: 'nav.VERIFICACIÓN',
        items: [
          { icon: 'ti-scan',    label: 'nav.verify',     route: '/verify' },
          { icon: 'ti-heart',   label: 'nav.my-jewelry', route: '/consumer/history' },
        ],
      },
      {
        label: 'nav.CUENTA',
        items: [
          { icon: 'ti-credit-card', label: 'nav.subscription',     route: '/subscription' },
          { icon: 'ti-building',    label: 'nav.register-company', route: '/consumer/register-company' },
        ],
      },
    ];
  });

  readonly planBadgeClass = computed(() => {
    const p = this.store.currentPlan();
    if (p === 'PLATINUM') return 'badge-top platinum';
    if (p === 'GOLD')     return 'badge-top gold';
    return 'badge-top silver';
  });

  readonly planLabel = computed(() => this.store.currentPlan() ?? 'SILVER');

  logout() { this.store.logout(this.router); }
}
