import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../store-manager.test-samples';

import { StoreManagerFormService } from './store-manager-form.service';

describe('StoreManager Form Service', () => {
  let service: StoreManagerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreManagerFormService);
  });

  describe('Service methods', () => {
    describe('createStoreManagerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStoreManagerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IStoreManager should create a new form with FormGroup', () => {
        const formGroup = service.createStoreManagerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getStoreManager', () => {
      it('should return NewStoreManager for default StoreManager initial value', () => {
        const formGroup = service.createStoreManagerFormGroup(sampleWithNewData);

        const storeManager = service.getStoreManager(formGroup) as any;

        expect(storeManager).toMatchObject(sampleWithNewData);
      });

      it('should return NewStoreManager for empty StoreManager initial value', () => {
        const formGroup = service.createStoreManagerFormGroup();

        const storeManager = service.getStoreManager(formGroup) as any;

        expect(storeManager).toMatchObject({});
      });

      it('should return IStoreManager', () => {
        const formGroup = service.createStoreManagerFormGroup(sampleWithRequiredData);

        const storeManager = service.getStoreManager(formGroup) as any;

        expect(storeManager).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStoreManager should not enable id FormControl', () => {
        const formGroup = service.createStoreManagerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStoreManager should disable id FormControl', () => {
        const formGroup = service.createStoreManagerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
