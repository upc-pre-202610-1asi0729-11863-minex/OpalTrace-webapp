import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const analyticsRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/analytics-dashboard/analytics-dashboard').then(m => m.AnalyticsDashboard),
    canActivate: [iamGuard],
    title: 'OpalTrace – Analytics Dashboard',
  },
  {
    path: 'shrinkage',
    loadComponent: () => import('./views/analytics-dashboard/analytics-dashboard').then(m => m.AnalyticsDashboard),
    canActivate: [iamGuard],
    title: 'OpalTrace – Merma',
  },
  {
    path: 'esg',
    loadComponent: () => import('./views/esg-report/esg-report').then(m => m.EsgReport),
    canActivate: [iamGuard],
    title: 'OpalTrace – Reporte ESG',
  },
  {
    path: 'comparative',
    loadComponent: () => import('./views/esg-report/esg-report').then(m => m.EsgReport),
    canActivate: [iamGuard],
    title: 'OpalTrace – Comparativo',
  },
];