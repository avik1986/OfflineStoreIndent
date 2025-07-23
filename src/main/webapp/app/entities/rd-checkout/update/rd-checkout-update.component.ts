import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRDCheckout } from '../rd-checkout.model';
import { RDCheckoutService } from '../service/rd-checkout.service';
import { RDCheckoutFormGroup, RDCheckoutFormService } from './rd-checkout-form.service';

@Component({
  selector: 'jhi-rd-checkout-update',
  templateUrl: './rd-checkout-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RDCheckoutUpdateComponent implements OnInit {
  isSaving = false;
  rDCheckout: IRDCheckout | null = null;

  protected rDCheckoutService = inject(RDCheckoutService);
  protected rDCheckoutFormService = inject(RDCheckoutFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RDCheckoutFormGroup = this.rDCheckoutFormService.createRDCheckoutFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rDCheckout }) => {
      this.rDCheckout = rDCheckout;
      if (rDCheckout) {
        this.updateForm(rDCheckout);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rDCheckout = this.rDCheckoutFormService.getRDCheckout(this.editForm);
    if (rDCheckout.id !== null) {
      this.subscribeToSaveResponse(this.rDCheckoutService.update(rDCheckout));
    } else {
      this.subscribeToSaveResponse(this.rDCheckoutService.create(rDCheckout));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRDCheckout>>): void {
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

  protected updateForm(rDCheckout: IRDCheckout): void {
    this.rDCheckout = rDCheckout;
    this.rDCheckoutFormService.resetForm(this.editForm, rDCheckout);
  }
}
