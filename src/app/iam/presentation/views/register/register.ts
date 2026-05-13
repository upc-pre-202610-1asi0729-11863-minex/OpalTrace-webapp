import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ selector: 'app-register', template: '' })
export class Register {
  constructor() { inject(Router).navigate(['/onboarding'], { replaceUrl: true }); }
}
