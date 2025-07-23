import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStore } from '../store.model';
import { StoreService } from '../service/store.service';

@Component({
  templateUrl: './store-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StoreDeleteDialogComponent {
  store?: IStore;

  protected storeService = inject(StoreService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.storeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
