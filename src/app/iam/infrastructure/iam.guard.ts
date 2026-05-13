import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';
import { inject } from '@angular/core';

export const iamGuard: CanActivateFn = (_route, _state) => {
  const store = inject(IamStore);
  const router = inject(Router);
  if (store.isAuthenticated()) return true;
  router.navigate(['/auth/login']);
  return false;
};
