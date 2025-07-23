import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IStoreManager } from '../store-manager.model';

@Component({
  selector: 'jhi-store-manager-detail',
  templateUrl: './store-manager-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class StoreManagerDetailComponent {
  storeManager = input<IStoreManager | null>(null);

  previousState(): void {
    window.history.back();
  }
}
