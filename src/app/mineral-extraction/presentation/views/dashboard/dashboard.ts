import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MineralStore, MineralBatch, BatchStatus } from '../../../application/mineral.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private store = inject(MineralStore);
  private iam   = inject(IamStore);

  readonly greetingKey  = computed(() => this.iam.greetingKey());
  readonly greetingName = computed(() => this.iam.greetingName());

  readonly batches      = this.store.batches;
  readonly alerts       = this.store.alerts;
  readonly pendingCount = this.store.pendingCount;

  readonly totalBatches     = computed(() => this.store.batches().length);
  readonly inTransitCount   = computed(() => this.store.batches().filter(b => b.status === 'En Tránsito').length);
  readonly activeAlertsCount = computed(() => this.store.alerts().length);
  readonly certifiedCount   = computed(() => this.store.batches().filter(b => b.status === 'Certificado').length);

  private readonly statusKeyMap: Record<string, string> = {
    'En Origen':   'batch-status.en-origen',
    'En Tránsito': 'batch-status.en-transito',
    'En Planta':   'batch-status.en-planta',
    'Certificado': 'batch-status.certificado',
  };

  badgeClass(status: BatchStatus, isBlocked: boolean): string {
    if (isBlocked) return 'badge badge-red';
    switch (status) {
      case 'Certificado':  return 'badge badge-green';
      case 'En Tránsito':  return 'badge badge-blue';
      case 'En Origen':    return 'badge badge-amber';
      case 'En Planta':    return 'badge badge-purple';
      default:             return 'badge badge-gray';
    }
  }

  statusTranslateKey(batch: MineralBatch): string {
    if (batch.isBlocked) return 'batch-status.bloqueado';
    return this.statusKeyMap[batch.status] ?? 'batch-status.en-origen';
  }
}
