import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICoupon } from '../coupon.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../coupon.test-samples';

import { CouponService } from './coupon.service';

const requireRestSample: ICoupon = {
  ...sampleWithRequiredData,
};

describe('Coupon Service', () => {
  let service: CouponService;
  let httpMock: HttpTestingController;
  let expectedResult: ICoupon | ICoupon[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CouponService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Coupon', () => {
      const coupon = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(coupon).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Coupon', () => {
      const coupon = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(coupon).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Coupon', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Coupon', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Coupon', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCouponToCollectionIfMissing', () => {
      it('should add a Coupon to an empty array', () => {
        const coupon: ICoupon = sampleWithRequiredData;
        expectedResult = service.addCouponToCollectionIfMissing([], coupon);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coupon);
      });

      it('should not add a Coupon to an array that contains it', () => {
        const coupon: ICoupon = sampleWithRequiredData;
        const couponCollection: ICoupon[] = [
          {
            ...coupon,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCouponToCollectionIfMissing(couponCollection, coupon);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Coupon to an array that doesn't contain it", () => {
        const coupon: ICoupon = sampleWithRequiredData;
        const couponCollection: ICoupon[] = [sampleWithPartialData];
        expectedResult = service.addCouponToCollectionIfMissing(couponCollection, coupon);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coupon);
      });

      it('should add only unique Coupon to an array', () => {
        const couponArray: ICoupon[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const couponCollection: ICoupon[] = [sampleWithRequiredData];
        expectedResult = service.addCouponToCollectionIfMissing(couponCollection, ...couponArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const coupon: ICoupon = sampleWithRequiredData;
        const coupon2: ICoupon = sampleWithPartialData;
        expectedResult = service.addCouponToCollectionIfMissing([], coupon, coupon2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coupon);
        expect(expectedResult).toContain(coupon2);
      });

      it('should accept null and undefined values', () => {
        const coupon: ICoupon = sampleWithRequiredData;
        expectedResult = service.addCouponToCollectionIfMissing([], null, coupon, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coupon);
      });

      it('should return initial array if no Coupon is added', () => {
        const couponCollection: ICoupon[] = [sampleWithRequiredData];
        expectedResult = service.addCouponToCollectionIfMissing(couponCollection, undefined, null);
        expect(expectedResult).toEqual(couponCollection);
      });
    });

    describe('compareCoupon', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCoupon(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
        const entity2 = null;

        const compareResult1 = service.compareCoupon(entity1, entity2);
        const compareResult2 = service.compareCoupon(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
        const entity2 = { id: 'd2da5bdf-05f9-480b-ba8c-82307bde9d7c' };

        const compareResult1 = service.compareCoupon(entity1, entity2);
        const compareResult2 = service.compareCoupon(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
        const entity2 = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };

        const compareResult1 = service.compareCoupon(entity1, entity2);
        const compareResult2 = service.compareCoupon(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
