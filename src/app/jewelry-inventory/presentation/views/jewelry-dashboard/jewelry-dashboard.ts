import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { JewelryStore } from '../../../application/jewelry.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-jewelry-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, TranslatePipe],
  templateUrl: './jewelry-dashboard.html',
})
export class JewelryDashboard {
  private store = inject(JewelryStore);
  private iam   = inject(IamStore);

  readonly greetingKey  = computed(() => this.iam.greetingKey());
  readonly greetingName = computed(() => this.iam.greetingName());

  readonly certifiedStock  = this.store.certifiedStock;
  readonly externalStock   = this.store.externalStock;
  readonly certificates    = this.store.certificates;

  readonly totalWeightG         = this.store.totalWeightG;
  readonly totalExternalWeightG = this.store.totalExternalWeightG;
  readonly certifiedCount       = this.store.certifiedCount;
  readonly rejectedCount        = this.store.rejectedCount;
  readonly pendingCount         = this.store.pendingCount;

  readonly recentCertifications = computed(() =>
    this.certificates().slice().reverse().slice(0, 5)
  );
}
