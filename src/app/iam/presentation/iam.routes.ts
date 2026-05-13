import { Routes } from '@angular/router';

export const iamRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login').then(m => m.Login),
    title: 'OpalTrace — Iniciar sesión',
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register/register').then(m => m.Register),
    title: 'OpalTrace — Registro empresarial',
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./views/forgot-password/forgot-password').then(m => m.ForgotPassword),
    title: 'OpalTrace — Recuperar contraseña',
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./views/reset-password/reset-password').then(m => m.ResetPassword),
    title: 'OpalTrace — Nueva contraseña',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
