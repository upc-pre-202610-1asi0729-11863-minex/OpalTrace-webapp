import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { iamGuard } from './iam/infrastructure/iam.guard';

const iamRoutes          = () => import('./iam/presentation/iam.routes').then(m => m.iamRoutes);
const subscriptionRoutes  = () => import('./subscriptions/presentation/subscriptions.routes').then(m => m.subscriptionsRoutes);
const mineralRoutes       = () => import('./mineral-extraction/presentation/mineral-extraction.routes').then(m => m.mineralExtractionRoutes);
const custodyRoutes       = () => import('./custody-chain/presentation/custody-chain.routes').then(m => m.custodyChainRoutes);
const refineryRoutes      = () => import('./refinery-processing/presentation/refinery-processing.routes').then(m => m.refineryProcessingRoutes);
const jewelryRoutes       = () => import('./jewelry-inventory/presentation/jewelry-inventory.routes').then(m => m.jewelryInventoryRoutes);
const analyticsRoutes     = () => import('./analytics/presentation/analytics.routes').then(m => m.analyticsRoutes);

const onboarding          = () => import('./iam/presentation/views/onboarding/onboarding').then(m => m.Onboarding);
const pageNotFound        = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const dashboardRouter     = () => import('./shared/presentation/views/dashboard-router/dashboard-router').then(m => m.DashboardRouter);

const verify              = () => import('./consumer-experience/presentation/views/verify/verify').then(m => m.Verify);
const verifyMap           = () => import('./consumer-experience/presentation/views/verify-map/verify-map').then(m => m.VerifyMap);
const consumerHistory     = () => import('./consumer-experience/presentation/views/consumer-history/consumer-history').then(m => m.ConsumerHistory);
const registerCompany     = () => import('./consumer-experience/presentation/views/register-company/register-company').then(m => m.RegisterCompany);

const baseTitle = 'OpalTrace';

export const routes: Routes = [
  // ── Public auth routes (no sidebar) ──────────────────────────────
  { path: 'auth', loadChildren: iamRoutes },
  { path: 'onboarding', loadComponent: onboarding, title: `${baseTitle} — Onboarding` },

  // ── Protected app shell (sidebar layout) ─────────────────────────
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      // Smart dashboard: redirects by segment
      { path: 'dashboard', loadComponent: dashboardRouter, title: `${baseTitle} — Dashboard` },

      // Consumer Experience (with sidebar)
      { path: 'verify',                    loadComponent: verify,          title: `${baseTitle} — Verificar` },
      { path: 'verify/:certificateId',     loadComponent: verify,          title: `${baseTitle} — Verificar autenticidad` },
      { path: 'verify/:certificateId/map', loadComponent: verifyMap,       title: `${baseTitle} — Mapa de trazabilidad` },
      { path: 'consumer/history',           loadComponent: consumerHistory,   title: `${baseTitle} — Historial` },
      { path: 'consumer/register-company', loadComponent: registerCompany,   title: `${baseTitle} — Registrar Empresa` },

      // Subscriptions
      { path: 'subscription', loadChildren: subscriptionRoutes, title: `${baseTitle} — Suscripción` },

      // Mineral Extraction
      { path: 'mineral', loadChildren: mineralRoutes },

      // Custody Chain
      { path: 'custody', loadChildren: custodyRoutes },

      // Refinery Processing
      { path: 'refinery', loadChildren: refineryRoutes },

      // Jewelry Inventory
      { path: 'jewelry', loadChildren: jewelryRoutes },

      // Analytics
      { path: 'analytics', loadChildren: analyticsRoutes },

      // Default: redirect to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} — Página no encontrada` },
];
