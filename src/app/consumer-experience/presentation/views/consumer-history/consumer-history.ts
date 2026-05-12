import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsumerStore } from '../../../application/consumer.store';

@Component({
  selector: 'app-consumer-history',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: './consumer-history.html',
})
export class ConsumerHistory {
  private store = inject(ConsumerStore);

  readonly verificationLog = this.store.verificationLog;
}
