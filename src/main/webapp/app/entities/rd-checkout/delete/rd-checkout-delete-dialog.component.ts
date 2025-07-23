import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRDCheckout } from '../rd-checkout.model';
import { RDCheckoutService } from '../service/rd-checkout.service';

@Component({
  templateUrl: './rd-checkout-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RDCheckoutDeleteDialogComponent {
  rDCheckout?: IRDCheckout;

  protected rDCheckoutService = inject(RDCheckoutService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.rDCheckoutService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
