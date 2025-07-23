import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStoreManager } from '../store-manager.model';
import { StoreManagerService } from '../service/store-manager.service';
import { StoreManagerFormGroup, StoreManagerFormService } from './store-manager-form.service';

@Component({
  selector: 'jhi-store-manager-update',
  templateUrl: './store-manager-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StoreManagerUpdateComponent implements OnInit {
  isSaving = false;
  storeManager: IStoreManager | null = null;

  protected storeManagerService = inject(StoreManagerService);
  protected storeManagerFormService = inject(StoreManagerFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StoreManagerFormGroup = this.storeManagerFormService.createStoreManagerFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeManager }) => {
      this.storeManager = storeManager;
      if (storeManager) {
        this.updateForm(storeManager);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const storeManager = this.storeManagerFormService.getStoreManager(this.editForm);
    if (storeManager.id !== null) {
      this.subscribeToSaveResponse(this.storeManagerService.update(storeManager));
    } else {
      this.subscribeToSaveResponse(this.storeManagerService.create(storeManager));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStoreManager>>): void {
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

  protected updateForm(storeManager: IStoreManager): void {
    this.storeManager = storeManager;
    this.storeManagerFormService.resetForm(this.editForm, storeManager);
  }
}
