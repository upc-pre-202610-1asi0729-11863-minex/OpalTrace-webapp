import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const subscriptionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/subscription-view').then(m => m.SubscriptionView),
    canActivate: [iamGuard],
    title: 'OpalTrace — Suscripción',
  },
];

