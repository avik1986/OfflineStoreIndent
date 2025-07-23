import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../rd-checkout.test-samples';

import { RDCheckoutFormService } from './rd-checkout-form.service';

describe('RDCheckout Form Service', () => {
  let service: RDCheckoutFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RDCheckoutFormService);
  });

  describe('Service methods', () => {
    describe('createRDCheckoutFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRDCheckoutFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            paymentStatus: expect.any(Object),
            orderId: expect.any(Object),
            orderDeliveryStatus: expect.any(Object),
          }),
        );
      });

      it('passing IRDCheckout should create a new form with FormGroup', () => {
        const formGroup = service.createRDCheckoutFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            paymentStatus: expect.any(Object),
            orderId: expect.any(Object),
            orderDeliveryStatus: expect.any(Object),
          }),
        );
      });
    });

    describe('getRDCheckout', () => {
      it('should return NewRDCheckout for default RDCheckout initial value', () => {
        const formGroup = service.createRDCheckoutFormGroup(sampleWithNewData);

        const rDCheckout = service.getRDCheckout(formGroup) as any;

        expect(rDCheckout).toMatchObject(sampleWithNewData);
      });

      it('should return NewRDCheckout for empty RDCheckout initial value', () => {
        const formGroup = service.createRDCheckoutFormGroup();

        const rDCheckout = service.getRDCheckout(formGroup) as any;

        expect(rDCheckout).toMatchObject({});
      });

      it('should return IRDCheckout', () => {
        const formGroup = service.createRDCheckoutFormGroup(sampleWithRequiredData);

        const rDCheckout = service.getRDCheckout(formGroup) as any;

        expect(rDCheckout).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRDCheckout should not enable id FormControl', () => {
        const formGroup = service.createRDCheckoutFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRDCheckout should disable id FormControl', () => {
        const formGroup = service.createRDCheckoutFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
