import { Component, signal, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type SyncStatus = 'pending' | 'syncing' | 'synced';
type SyncState  = 'idle' | 'syncing' | 'done';

interface SyncRecord {
  provId:     string;
  type:       'batch' | 'gps';
  timestamp:  string;
  detail:     string;
  status:     SyncStatus;
}

const INITIAL_RECORDS: SyncRecord[] = [
  { provId: 'OFF-0001', type: 'batch', timestamp: '07/05 · 08:12:34', detail: '180 kg · Plata', status: 'pending' },
  { provId: 'OFF-0002', type: 'gps',   timestamp: '07/05 · 08:45:10', detail: 'Lote OT-2026-0041', status: 'pending' },
  { provId: 'OFF-0003', type: 'batch', timestamp: '07/05 · 09:02:55', detail: '310 kg · Oro', status: 'pending' },
];

@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './sync.html',
})
export class Sync {
  syncState = signal<SyncState>('idle');
  records   = signal<SyncRecord[]>(INITIAL_RECORDS.map(r => ({ ...r })));

  readonly pendingCount = computed(() =>
    this.records().filter(r => r.status === 'pending').length
  );

  forceSync(): void {
    if (this.syncState() !== 'idle') return;
    this.syncState.set('syncing');

    this.records.update(rs =>
      rs.map((r, i) => i < 2 ? { ...r, status: 'synced' } : { ...r, status: 'syncing' })
    );

    setTimeout(() => {
      this.records.update(rs => rs.map(r => ({ ...r, status: 'synced' })));
      this.syncState.set('done');
    }, 2500);
  }

  statusBadgeClass(status: SyncStatus, syncState: SyncState): string {
    if (status === 'synced')  return 'badge badge-green';
    if (status === 'syncing') return 'badge badge-amber';
    return 'badge badge-gray';
  }

  typeLabel(type: 'batch' | 'gps'): string {
    return type === 'batch' ? 'sync.type-batch' : 'sync.type-gps';
  }

  statusLabel(status: SyncStatus): string {
    if (status === 'synced')  return 'sync.status-synced';
    if (status === 'syncing') return 'sync.status-processing';
    return 'sync.status-queue';
  }
}
