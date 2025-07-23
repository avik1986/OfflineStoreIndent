import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStoreManager } from '../store-manager.model';
import { StoreManagerService } from '../service/store-manager.service';

@Component({
  templateUrl: './store-manager-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StoreManagerDeleteDialogComponent {
  storeManager?: IStoreManager;

  protected storeManagerService = inject(StoreManagerService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.storeManagerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
