import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MineralStore, MineralBatch, MineralType } from '../../../application/mineral.store';

@Component({
  selector: 'app-my-batches',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './my-batches.html',
})
export class MyBatches {
  private store  = inject(MineralStore);
  private router = inject(Router);

  readonly allBatches = this.store.batches;

  searchId      = signal('');
  filterMineral = signal<MineralType | ''>('');
  filterState   = signal('');

  readonly mineralOptions: Array<MineralType | ''> = ['', 'Oro', 'Plata'];
  readonly stateOptions = ['', 'En Origen', 'En Tránsito', 'En Planta', 'Bloqueado', 'Certificado'];

  private readonly statusKeyMap: Record<string, string> = {
    'En Origen':   'batch-status.en-origen',
    'En Tránsito': 'batch-status.en-transito',
    'En Planta':   'batch-status.en-planta',
    'Certificado': 'batch-status.certificado',
    'Bloqueado':   'batch-status.bloqueado',
  };

  statusTranslateKey(b: MineralBatch): string {
    if (b.isBlocked) return 'batch-status.bloqueado';
    return this.statusKeyMap[b.status] ?? 'batch-status.en-origen';
  }

  stateOptionKey(s: string): string {
    return this.statusKeyMap[s] ?? 'batch-status.en-origen';
  }

  readonly filtered = computed(() => {
    let batches = this.allBatches();
    const id = this.searchId().trim().toLowerCase();
    if (id) batches = batches.filter(b => b.batchId.toLowerCase().includes(id));
    const min = this.filterMineral();
    if (min) batches = batches.filter(b => b.mineral === min);
    const state = this.filterState();
    if (state === 'Bloqueado') {
      batches = batches.filter(b => b.isBlocked);
    } else if (state) {
      batches = batches.filter(b => !b.isBlocked && b.status === state);
    }
    return batches;
  });

  statusBadgeClass(b: MineralBatch): string {
    if (b.isBlocked) return 'badge badge-red';
    switch (b.status) {
      case 'En Origen':   return 'badge badge-amber';
      case 'En Tránsito': return 'badge badge-blue';
      case 'En Planta':   return 'badge badge-purple';
      case 'Certificado': return 'badge badge-green';
      default:            return 'badge badge-gray';
    }
  }

  statusLabel(b: MineralBatch): string {
    if (b.isBlocked) return 'Bloqueado';
    return b.status;
  }

  canShowCertificate(b: MineralBatch): boolean {
    return !b.isBlocked;
  }

  goToRegister(): void {
    this.router.navigate(['/mineral/register']);
  }

  goToCertificate(batchId: string): void {
    this.router.navigate(['/mineral/certificate', batchId]);
  }
}
