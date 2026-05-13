import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const refineryProcessingRoutes: Routes = [
  { path: '', redirectTo: 'receive', pathMatch: 'full' },
  {
    path: 'receive',
    loadComponent: () => import('./views/receive-batch/receive-batch').then(m => m.ReceiveBatch),
    canActivate: [iamGuard],
  },
  {
    path: 'split/:batchId',
    loadComponent: () => import('./views/split-batch/split-batch').then(m => m.SplitBatch),
    canActivate: [iamGuard],
  },
  {
    path: 'split',
    loadComponent: () => import('./views/split-batch/split-batch').then(m => m.SplitBatch),
    canActivate: [iamGuard],
  },
  {
    path: 'shrinkage',
    loadComponent: () => import('./views/shrinkage/shrinkage').then(m => m.Shrinkage),
    canActivate: [iamGuard],
  },
  {
    path: 'sublots',
    loadComponent: () => import('./views/split-batch/split-batch').then(m => m.SplitBatch),
    canActivate: [iamGuard],
  },
];
