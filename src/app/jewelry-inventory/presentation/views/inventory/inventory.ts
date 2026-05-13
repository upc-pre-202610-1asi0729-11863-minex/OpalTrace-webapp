import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { JewelryStore } from '../../../application/jewelry.store';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './inventory.html',
})
export class Inventory {
  private store = inject(JewelryStore);

  readonly certifiedStock = this.store.certifiedStock;
  readonly externalStock  = this.store.externalStock;
}
