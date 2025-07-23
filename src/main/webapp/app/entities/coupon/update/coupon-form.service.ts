import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICoupon, NewCoupon } from '../coupon.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICoupon for edit and NewCouponFormGroupInput for create.
 */
type CouponFormGroupInput = ICoupon | PartialWithRequiredKeyOf<NewCoupon>;

type CouponFormDefaults = Pick<NewCoupon, 'id'>;

type CouponFormGroupContent = {
  id: FormControl<ICoupon['id'] | NewCoupon['id']>;
  text: FormControl<ICoupon['text']>;
  type: FormControl<ICoupon['type']>;
  value: FormControl<ICoupon['value']>;
};

export type CouponFormGroup = FormGroup<CouponFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CouponFormService {
  createCouponFormGroup(coupon: CouponFormGroupInput = { id: null }): CouponFormGroup {
    const couponRawValue = {
      ...this.getFormDefaults(),
      ...coupon,
    };
    return new FormGroup<CouponFormGroupContent>({
      id: new FormControl(
        { value: couponRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      text: new FormControl(couponRawValue.text),
      type: new FormControl(couponRawValue.type),
      value: new FormControl(couponRawValue.value),
    });
  }

  getCoupon(form: CouponFormGroup): ICoupon | NewCoupon {
    return form.getRawValue() as ICoupon | NewCoupon;
  }

  resetForm(form: CouponFormGroup, coupon: CouponFormGroupInput): void {
    const couponRawValue = { ...this.getFormDefaults(), ...coupon };
    form.reset(
      {
        ...couponRawValue,
        id: { value: couponRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CouponFormDefaults {
    return {
      id: null,
    };
  }
}
