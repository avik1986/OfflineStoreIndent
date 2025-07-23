import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IStore } from '../store.model';

@Component({
  selector: 'jhi-store-detail',
  templateUrl: './store-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class StoreDetailComponent {
  store = input<IStore | null>(null);

  previousState(): void {
    window.history.back();
  }
}
