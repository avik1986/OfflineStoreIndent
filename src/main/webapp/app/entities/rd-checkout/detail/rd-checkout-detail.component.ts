import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IRDCheckout } from '../rd-checkout.model';

@Component({
  selector: 'jhi-rd-checkout-detail',
  templateUrl: './rd-checkout-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class RDCheckoutDetailComponent {
  rDCheckout = input<IRDCheckout | null>(null);

  previousState(): void {
    window.history.back();
  }
}
