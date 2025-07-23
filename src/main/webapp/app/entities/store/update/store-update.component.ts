import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStore } from '../store.model';
import { StoreService } from '../service/store.service';
import { StoreFormGroup, StoreFormService } from './store-form.service';

@Component({
  selector: 'jhi-store-update',
  templateUrl: './store-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StoreUpdateComponent implements OnInit {
  isSaving = false;
  store: IStore | null = null;

  protected storeService = inject(StoreService);
  protected storeFormService = inject(StoreFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StoreFormGroup = this.storeFormService.createStoreFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ store }) => {
      this.store = store;
      if (store) {
        this.updateForm(store);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const store = this.storeFormService.getStore(this.editForm);
    if (store.id !== null) {
      this.subscribeToSaveResponse(this.storeService.update(store));
    } else {
      this.subscribeToSaveResponse(this.storeService.create(store));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStore>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(store: IStore): void {
    this.store = store;
    this.storeFormService.resetForm(this.editForm, store);
  }
}
