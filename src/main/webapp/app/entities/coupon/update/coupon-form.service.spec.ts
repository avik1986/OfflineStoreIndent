import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../coupon.test-samples';

import { CouponFormService } from './coupon-form.service';

describe('Coupon Form Service', () => {
  let service: CouponFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponFormService);
  });

  describe('Service methods', () => {
    describe('createCouponFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCouponFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            text: expect.any(Object),
            type: expect.any(Object),
            value: expect.any(Object),
          }),
        );
      });

      it('passing ICoupon should create a new form with FormGroup', () => {
        const formGroup = service.createCouponFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            text: expect.any(Object),
            type: expect.any(Object),
            value: expect.any(Object),
          }),
        );
      });
    });

    describe('getCoupon', () => {
      it('should return NewCoupon for default Coupon initial value', () => {
        const formGroup = service.createCouponFormGroup(sampleWithNewData);

        const coupon = service.getCoupon(formGroup) as any;

        expect(coupon).toMatchObject(sampleWithNewData);
      });

      it('should return NewCoupon for empty Coupon initial value', () => {
        const formGroup = service.createCouponFormGroup();

        const coupon = service.getCoupon(formGroup) as any;

        expect(coupon).toMatchObject({});
      });

      it('should return ICoupon', () => {
        const formGroup = service.createCouponFormGroup(sampleWithRequiredData);

        const coupon = service.getCoupon(formGroup) as any;

        expect(coupon).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICoupon should not enable id FormControl', () => {
        const formGroup = service.createCouponFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCoupon should disable id FormControl', () => {
        const formGroup = service.createCouponFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
