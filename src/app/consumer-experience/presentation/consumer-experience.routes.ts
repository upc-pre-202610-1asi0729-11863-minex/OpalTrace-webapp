import { Routes } from '@angular/router';

export const consumerExperienceRoutes: Routes = [
  {
    path: 'verify',
    loadComponent: () => import('./views/verify/verify').then(m => m.Verify),
    title: 'OpalTrace – Verificar Autenticidad',
  },
  {
    path: 'verify/:certificateId',
    loadComponent: () => import('./views/verify/verify').then(m => m.Verify),
    title: 'OpalTrace – Verificar Certificado',
  },
  {
    path: 'verify/:certificateId/map',
    loadComponent: () => import('./views/verify-map/verify-map').then(m => m.VerifyMap),
    title: 'OpalTrace – Mapa de Trazabilidad',
  },
  {
    path: 'consumer/history',
    loadComponent: () => import('./views/consumer-history/consumer-history').then(m => m.ConsumerHistory),
    title: 'OpalTrace – Historial del Consumidor',
  },
];
