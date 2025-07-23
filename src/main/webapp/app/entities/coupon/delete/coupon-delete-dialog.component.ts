import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICoupon } from '../coupon.model';
import { CouponService } from '../service/coupon.service';

@Component({
  templateUrl: './coupon-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CouponDeleteDialogComponent {
  coupon?: ICoupon;

  protected couponService = inject(CouponService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.couponService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
