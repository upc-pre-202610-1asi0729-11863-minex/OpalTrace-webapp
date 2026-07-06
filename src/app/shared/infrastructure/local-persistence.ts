import { Injectable, inject } from '@angular/core';
import { IamStore } from '../../iam/application/iam.store';

/**
 * Client-side persistence for domain snapshots, scoped per authenticated user.
 * Keeps operational state (batches, products, certificates) available across
 * page reloads while the backend synchronization completes. Entities are stored
 * as plain property snapshots; each store rebuilds its own entities on read.
 */
@Injectable({ providedIn: 'root' })
export class LocalPersistence {
  private readonly iam = inject(IamStore);

  private key(namespace: string): string {
    const uid = this.iam.currentUser()?.id ?? 'anon';
    return `ot_cache_${namespace}_${uid}`;
  }

  read<T>(namespace: string): T[] {
    try {
      const raw = localStorage.getItem(this.key(namespace));
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  write<T>(namespace: string, value: T[]): void {
    try {
      localStorage.setItem(this.key(namespace), JSON.stringify(value));
    } catch {
      /* storage unavailable or quota exceeded — non-fatal */
    }
  }
}
