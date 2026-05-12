import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Smart dashboard entry point.
 * Reads the current user segment from IamStore and delegates
 * to the appropriate bounded-context dashboard.
 */
@Component({
  selector: 'app-dashboard-router',
  template: `<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#888">
    <span>Cargando dashboard...</span>
  </div>`,
})
export class DashboardRouter implements OnInit {
  private store  = inject(IamStore);
  private router = inject(Router);

  ngOnInit(): void {
    const segment = this.store.currentSegment();
    if (segment === 'JEWELRY') {
      this.router.navigate(['/jewelry/dashboard'], { replaceUrl: true });
    } else if (segment === 'CONSUMER') {
      this.router.navigate(['/verify'], { replaceUrl: true });
    } else {
      // MINING (default)
      this.router.navigate(['/mineral/dashboard'], { replaceUrl: true });
    }
  }
}
