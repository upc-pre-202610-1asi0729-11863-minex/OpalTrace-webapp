import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './register-company.html',
})
export class RegisterCompany {
  private router = inject(Router);

  goToOnboarding(segment: 'MINING' | 'JEWELRY'): void {
    this.router.navigate(['/onboarding'], { queryParams: { profile: segment } });
  }
}
