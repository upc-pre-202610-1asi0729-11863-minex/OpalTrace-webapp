import { Routes } from '@angular/router';

export const iamRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login').then(m => m.Login),
    title: 'OpalTrace — Sign In',
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register/register').then(m => m.Register),
    title: 'OpalTrace — Register',
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./views/forgot-password/forgot-password').then(m => m.ForgotPassword),
    title: 'OpalTrace — Password Recovery',
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./views/reset-password/reset-password').then(m => m.ResetPassword),
    title: 'OpalTrace — Reset Password',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
