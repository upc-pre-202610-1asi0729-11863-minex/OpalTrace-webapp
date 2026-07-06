import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsumerStore } from '../../../application/consumer.store';

@Component({
  selector: 'app-my-jewelry',
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: './my-jewelry.html',
  styleUrl: './my-jewelry.css',
})
export class MyJewelry {
  private store = inject(ConsumerStore);

  readonly pieces = computed(() => {
    const certs = this.store.certificates();
    return this.store.verificationLog()
      .filter(entry => entry.authentic)
      .map(entry => {
        const cert = certs.find(c => c.certId.toUpperCase() === entry.certId.toUpperCase());
        return {
          certId:      entry.certId,
          productName: entry.productName,
          verifiedAt:  entry.verifiedAt,
          jewelerName: cert?.jewelerName ?? null,
          issuedAt:    cert?.issuedAt    ?? null,
          certState:   cert?.certState   ?? 'CERTIFIED',
        };
      });
  });
}
