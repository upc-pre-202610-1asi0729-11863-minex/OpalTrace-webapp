import { Routes } from '@angular/router';
import { iamGuard } from '../../iam/infrastructure/iam.guard';

export const jewelryInventoryRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/jewelry-dashboard/jewelry-dashboard').then(m => m.JewelryDashboard),
    canActivate: [iamGuard],
    title: 'OpalTrace – Dashboard Joyería',
  },
  {
    path: 'inventory',
    loadComponent: () => import('./views/inventory/inventory').then(m => m.Inventory),
    canActivate: [iamGuard],
    title: 'OpalTrace – Inventario',
  },
  {
    path: 'receive',
    loadComponent: () => import('./views/receive-material/receive-material').then(m => m.ReceiveMaterial),
    canActivate: [iamGuard],
    title: 'OpalTrace – Recepcionar Material',
  },
  {
    path: 'external',
    loadComponent: () => import('./views/external-material/external-material').then(m => m.ExternalMaterial),
    canActivate: [iamGuard],
    title: 'OpalTrace – Material Externo',
  },
  {
    path: 'certify',
    loadComponent: () => import('./views/certify/certify').then(m => m.Certify),
    canActivate: [iamGuard],
    title: 'OpalTrace – Certificar Producto',
  },
];
