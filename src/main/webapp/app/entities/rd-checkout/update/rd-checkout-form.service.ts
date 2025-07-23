import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRDCheckout, NewRDCheckout } from '../rd-checkout.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRDCheckout for edit and NewRDCheckoutFormGroupInput for create.
 */
type RDCheckoutFormGroupInput = IRDCheckout | PartialWithRequiredKeyOf<NewRDCheckout>;

type RDCheckoutFormDefaults = Pick<NewRDCheckout, 'id'>;

type RDCheckoutFormGroupContent = {
  id: FormControl<IRDCheckout['id'] | NewRDCheckout['id']>;
  status: FormControl<IRDCheckout['status']>;
  paymentStatus: FormControl<IRDCheckout['paymentStatus']>;
  orderId: FormControl<IRDCheckout['orderId']>;
  orderDeliveryStatus: FormControl<IRDCheckout['orderDeliveryStatus']>;
};

export type RDCheckoutFormGroup = FormGroup<RDCheckoutFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RDCheckoutFormService {
  createRDCheckoutFormGroup(rDCheckout: RDCheckoutFormGroupInput = { id: null }): RDCheckoutFormGroup {
    const rDCheckoutRawValue = {
      ...this.getFormDefaults(),
      ...rDCheckout,
    };
    return new FormGroup<RDCheckoutFormGroupContent>({
      id: new FormControl(
        { value: rDCheckoutRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      status: new FormControl(rDCheckoutRawValue.status),
      paymentStatus: new FormControl(rDCheckoutRawValue.paymentStatus),
      orderId: new FormControl(rDCheckoutRawValue.orderId),
      orderDeliveryStatus: new FormControl(rDCheckoutRawValue.orderDeliveryStatus),
    });
  }

  getRDCheckout(form: RDCheckoutFormGroup): IRDCheckout | NewRDCheckout {
    return form.getRawValue() as IRDCheckout | NewRDCheckout;
  }

  resetForm(form: RDCheckoutFormGroup, rDCheckout: RDCheckoutFormGroupInput): void {
    const rDCheckoutRawValue = { ...this.getFormDefaults(), ...rDCheckout };
    form.reset(
      {
        ...rDCheckoutRawValue,
        id: { value: rDCheckoutRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RDCheckoutFormDefaults {
    return {
      id: null,
    };
  }
}
