import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ICoupon } from '../coupon.model';

@Component({
  selector: 'jhi-coupon-detail',
  templateUrl: './coupon-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class CouponDetailComponent {
  coupon = input<ICoupon | null>(null);

  previousState(): void {
    window.history.back();
  }
}
