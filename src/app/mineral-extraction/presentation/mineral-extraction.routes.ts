import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const mineralExtractionRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [iamGuard],
    title: 'OpalTrace – Dashboard',
  },
  {
    path: 'batches',
    loadComponent: () => import('./views/my-batches/my-batches').then(m => m.MyBatches),
    canActivate: [iamGuard],
    title: 'OpalTrace – Mis Lotes',
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register-batch/register-batch').then(m => m.RegisterBatch),
    canActivate: [iamGuard],
    title: 'OpalTrace – Registrar Lote',
  },
  {
    path: 'alerts',
    loadComponent: () => import('./views/alerts/alerts').then(m => m.Alerts),
    canActivate: [iamGuard],
    title: 'OpalTrace – Alertas',
  },
  {
    path: 'sync',
    loadComponent: () => import('./views/sync/sync').then(m => m.Sync),
    canActivate: [iamGuard],
    title: 'OpalTrace – Sincronización',
  },
  {
    path: 'certificate/:batchId',
    loadComponent: () => import('./views/batch-certificate/batch-certificate').then(m => m.BatchCertificate),
    canActivate: [iamGuard],
    title: 'OpalTrace – Certificado de Origen',
  },
];
