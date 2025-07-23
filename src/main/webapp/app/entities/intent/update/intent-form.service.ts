import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIntent, NewIntent } from '../intent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIntent for edit and NewIntentFormGroupInput for create.
 */
type IntentFormGroupInput = IIntent | PartialWithRequiredKeyOf<NewIntent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IIntent | NewIntent> = Omit<T, 'createdTime' | 'updatedTime'> & {
  createdTime?: string | null;
  updatedTime?: string | null;
};

type IntentFormRawValue = FormValueOf<IIntent>;

type NewIntentFormRawValue = FormValueOf<NewIntent>;

type IntentFormDefaults = Pick<NewIntent, 'id' | 'createdTime' | 'updatedTime'>;

type IntentFormGroupContent = {
  id: FormControl<IntentFormRawValue['id'] | NewIntent['id']>;
  commission: FormControl<IntentFormRawValue['commission']>;
  createdTime: FormControl<IntentFormRawValue['createdTime']>;
  createdBy: FormControl<IntentFormRawValue['createdBy']>;
  updatedTime: FormControl<IntentFormRawValue['updatedTime']>;
  updatedBy: FormControl<IntentFormRawValue['updatedBy']>;
  article: FormControl<IntentFormRawValue['article']>;
  user: FormControl<IntentFormRawValue['user']>;
  storeManager: FormControl<IntentFormRawValue['storeManager']>;
  store: FormControl<IntentFormRawValue['store']>;
  coupon: FormControl<IntentFormRawValue['coupon']>;
  rdCheckout: FormControl<IntentFormRawValue['rdCheckout']>;
};

export type IntentFormGroup = FormGroup<IntentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IntentFormService {
  createIntentFormGroup(intent: IntentFormGroupInput = { id: null }): IntentFormGroup {
    const intentRawValue = this.convertIntentToIntentRawValue({
      ...this.getFormDefaults(),
      ...intent,
    });
    return new FormGroup<IntentFormGroupContent>({
      id: new FormControl(
        { value: intentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      commission: new FormControl(intentRawValue.commission),
      createdTime: new FormControl(intentRawValue.createdTime, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(intentRawValue.createdBy),
      updatedTime: new FormControl(intentRawValue.updatedTime),
      updatedBy: new FormControl(intentRawValue.updatedBy),
      article: new FormControl(intentRawValue.article),
      user: new FormControl(intentRawValue.user),
      storeManager: new FormControl(intentRawValue.storeManager),
      store: new FormControl(intentRawValue.store),
      coupon: new FormControl(intentRawValue.coupon),
      rdCheckout: new FormControl(intentRawValue.rdCheckout),
    });
  }

  getIntent(form: IntentFormGroup): IIntent | NewIntent {
    return this.convertIntentRawValueToIntent(form.getRawValue() as IntentFormRawValue | NewIntentFormRawValue);
  }

  resetForm(form: IntentFormGroup, intent: IntentFormGroupInput): void {
    const intentRawValue = this.convertIntentToIntentRawValue({ ...this.getFormDefaults(), ...intent });
    form.reset(
      {
        ...intentRawValue,
        id: { value: intentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): IntentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdTime: currentTime,
      updatedTime: currentTime,
    };
  }

  private convertIntentRawValueToIntent(rawIntent: IntentFormRawValue | NewIntentFormRawValue): IIntent | NewIntent {
    return {
      ...rawIntent,
      createdTime: dayjs(rawIntent.createdTime, DATE_TIME_FORMAT),
      updatedTime: dayjs(rawIntent.updatedTime, DATE_TIME_FORMAT),
    };
  }

  private convertIntentToIntentRawValue(
    intent: IIntent | (Partial<NewIntent> & IntentFormDefaults),
  ): IntentFormRawValue | PartialWithRequiredKeyOf<NewIntentFormRawValue> {
    return {
      ...intent,
      createdTime: intent.createdTime ? intent.createdTime.format(DATE_TIME_FORMAT) : undefined,
      updatedTime: intent.updatedTime ? intent.updatedTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
