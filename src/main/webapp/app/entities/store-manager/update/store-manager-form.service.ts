import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IStoreManager, NewStoreManager } from '../store-manager.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStoreManager for edit and NewStoreManagerFormGroupInput for create.
 */
type StoreManagerFormGroupInput = IStoreManager | PartialWithRequiredKeyOf<NewStoreManager>;

type StoreManagerFormDefaults = Pick<NewStoreManager, 'id'>;

type StoreManagerFormGroupContent = {
  id: FormControl<IStoreManager['id'] | NewStoreManager['id']>;
  name: FormControl<IStoreManager['name']>;
};

export type StoreManagerFormGroup = FormGroup<StoreManagerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StoreManagerFormService {
  createStoreManagerFormGroup(storeManager: StoreManagerFormGroupInput = { id: null }): StoreManagerFormGroup {
    const storeManagerRawValue = {
      ...this.getFormDefaults(),
      ...storeManager,
    };
    return new FormGroup<StoreManagerFormGroupContent>({
      id: new FormControl(
        { value: storeManagerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(storeManagerRawValue.name),
    });
  }

  getStoreManager(form: StoreManagerFormGroup): IStoreManager | NewStoreManager {
    return form.getRawValue() as IStoreManager | NewStoreManager;
  }

  resetForm(form: StoreManagerFormGroup, storeManager: StoreManagerFormGroupInput): void {
    const storeManagerRawValue = { ...this.getFormDefaults(), ...storeManager };
    form.reset(
      {
        ...storeManagerRawValue,
        id: { value: storeManagerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StoreManagerFormDefaults {
    return {
      id: null,
    };
  }
}
