import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IStore, NewStore } from '../store.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStore for edit and NewStoreFormGroupInput for create.
 */
type StoreFormGroupInput = IStore | PartialWithRequiredKeyOf<NewStore>;

type StoreFormDefaults = Pick<NewStore, 'id'>;

type StoreFormGroupContent = {
  id: FormControl<IStore['id'] | NewStore['id']>;
  name: FormControl<IStore['name']>;
};

export type StoreFormGroup = FormGroup<StoreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StoreFormService {
  createStoreFormGroup(store: StoreFormGroupInput = { id: null }): StoreFormGroup {
    const storeRawValue = {
      ...this.getFormDefaults(),
      ...store,
    };
    return new FormGroup<StoreFormGroupContent>({
      id: new FormControl(
        { value: storeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(storeRawValue.name),
    });
  }

  getStore(form: StoreFormGroup): IStore | NewStore {
    return form.getRawValue() as IStore | NewStore;
  }

  resetForm(form: StoreFormGroup, store: StoreFormGroupInput): void {
    const storeRawValue = { ...this.getFormDefaults(), ...store };
    form.reset(
      {
        ...storeRawValue,
        id: { value: storeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StoreFormDefaults {
    return {
      id: null,
    };
  }
}
