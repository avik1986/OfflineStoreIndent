import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IIntent } from '../intent.model';

@Component({
  selector: 'jhi-intent-detail',
  templateUrl: './intent-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class IntentDetailComponent {
  intent = input<IIntent | null>(null);

  previousState(): void {
    window.history.back();
  }
}
