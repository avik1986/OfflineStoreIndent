import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../intent.test-samples';

import { IntentFormService } from './intent-form.service';

describe('Intent Form Service', () => {
  let service: IntentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntentFormService);
  });

  describe('Service methods', () => {
    describe('createIntentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIntentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            commission: expect.any(Object),
            createdTime: expect.any(Object),
            createdBy: expect.any(Object),
            updatedTime: expect.any(Object),
            updatedBy: expect.any(Object),
            article: expect.any(Object),
            user: expect.any(Object),
            storeManager: expect.any(Object),
            store: expect.any(Object),
            coupon: expect.any(Object),
            rdCheckout: expect.any(Object),
          }),
        );
      });

      it('passing IIntent should create a new form with FormGroup', () => {
        const formGroup = service.createIntentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            commission: expect.any(Object),
            createdTime: expect.any(Object),
            createdBy: expect.any(Object),
            updatedTime: expect.any(Object),
            updatedBy: expect.any(Object),
            article: expect.any(Object),
            user: expect.any(Object),
            storeManager: expect.any(Object),
            store: expect.any(Object),
            coupon: expect.any(Object),
            rdCheckout: expect.any(Object),
          }),
        );
      });
    });

    describe('getIntent', () => {
      it('should return NewIntent for default Intent initial value', () => {
        const formGroup = service.createIntentFormGroup(sampleWithNewData);

        const intent = service.getIntent(formGroup) as any;

        expect(intent).toMatchObject(sampleWithNewData);
      });

      it('should return NewIntent for empty Intent initial value', () => {
        const formGroup = service.createIntentFormGroup();

        const intent = service.getIntent(formGroup) as any;

        expect(intent).toMatchObject({});
      });

      it('should return IIntent', () => {
        const formGroup = service.createIntentFormGroup(sampleWithRequiredData);

        const intent = service.getIntent(formGroup) as any;

        expect(intent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIntent should not enable id FormControl', () => {
        const formGroup = service.createIntentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIntent should disable id FormControl', () => {
        const formGroup = service.createIntentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
