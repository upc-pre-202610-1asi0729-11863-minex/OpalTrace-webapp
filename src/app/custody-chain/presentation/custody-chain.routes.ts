import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const custodyChainRoutes: Routes = [
  { path: '', redirectTo: 'transfer', pathMatch: 'full' },
  {
    path: 'transfer',
    loadComponent: () => import('./views/custody-transfer/custody-transfer').then(m => m.CustodyTransfer),
    canActivate: [iamGuard],
  },
  {
    path: 'location',
    loadComponent: () => import('./views/location-update/location-update').then(m => m.LocationUpdate),
    canActivate: [iamGuard],
  },
];