

import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { JewelryStore } from '../../../application/jewelry.store';
import { IamStore } from '../../../../iam/application/iam.store';

const MINERAL_TYPES = ['Oro', 'Plata', 'Cobre', 'Otro'] as const;
type MineralType = typeof MINERAL_TYPES[number];

@Component({
  selector: 'app-external-material',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './external-material.html',
})
export class ExternalMaterial {
  private store = inject(JewelryStore);
  private iam   = inject(IamStore);

  readonly isPlatinum = this.iam.isPlatinum;

  readonly mineralTypes = MINERAL_TYPES;

  mineralType = signal<MineralType>('Oro');
  weightG     = signal<number | null>(null);
  supplier    = signal('');
  ruc         = signal('');
  entryDate   = signal(new Date().toISOString().slice(0, 10));
  invoice     = signal('');

  submitted = signal(false);
  extId     = signal('');

  readonly canSubmit = computed(
    () =>
      (this.weightG() ?? 0) > 0 &&
      this.supplier().trim() !== '' &&
      this.entryDate() !== ''
  );

  submit(): void {
    if (!this.canSubmit()) return;
    const id = this.store.registerExternalMaterial({
      mineralType: this.mineralType(),
      weightG:     this.weightG()!,
      supplier:    this.supplier().trim(),
      ruc:         this.ruc().trim() || undefined,
      entryDate:   this.entryDate(),
      invoice:     this.invoice().trim() || undefined,
    });
    this.extId.set(id);
    this.submitted.set(true);
  }

  reset(): void {
    this.mineralType.set('Oro');
    this.weightG.set(null);
    this.supplier.set('');
    this.ruc.set('');
    this.entryDate.set(new Date().toISOString().slice(0, 10));
    this.invoice.set('');
    this.extId.set('');
    this.submitted.set(false);
  }
}
