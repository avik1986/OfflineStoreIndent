import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRDCheckout } from '../rd-checkout.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../rd-checkout.test-samples';

import { RDCheckoutService } from './rd-checkout.service';

const requireRestSample: IRDCheckout = {
  ...sampleWithRequiredData,
};

describe('RDCheckout Service', () => {
  let service: RDCheckoutService;
  let httpMock: HttpTestingController;
  let expectedResult: IRDCheckout | IRDCheckout[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RDCheckoutService);
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

    it('should create a RDCheckout', () => {
      const rDCheckout = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rDCheckout).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RDCheckout', () => {
      const rDCheckout = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rDCheckout).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RDCheckout', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RDCheckout', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RDCheckout', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRDCheckoutToCollectionIfMissing', () => {
      it('should add a RDCheckout to an empty array', () => {
        const rDCheckout: IRDCheckout = sampleWithRequiredData;
        expectedResult = service.addRDCheckoutToCollectionIfMissing([], rDCheckout);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rDCheckout);
      });

      it('should not add a RDCheckout to an array that contains it', () => {
        const rDCheckout: IRDCheckout = sampleWithRequiredData;
        const rDCheckoutCollection: IRDCheckout[] = [
          {
            ...rDCheckout,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRDCheckoutToCollectionIfMissing(rDCheckoutCollection, rDCheckout);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RDCheckout to an array that doesn't contain it", () => {
        const rDCheckout: IRDCheckout = sampleWithRequiredData;
        const rDCheckoutCollection: IRDCheckout[] = [sampleWithPartialData];
        expectedResult = service.addRDCheckoutToCollectionIfMissing(rDCheckoutCollection, rDCheckout);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rDCheckout);
      });

      it('should add only unique RDCheckout to an array', () => {
        const rDCheckoutArray: IRDCheckout[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rDCheckoutCollection: IRDCheckout[] = [sampleWithRequiredData];
        expectedResult = service.addRDCheckoutToCollectionIfMissing(rDCheckoutCollection, ...rDCheckoutArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rDCheckout: IRDCheckout = sampleWithRequiredData;
        const rDCheckout2: IRDCheckout = sampleWithPartialData;
        expectedResult = service.addRDCheckoutToCollectionIfMissing([], rDCheckout, rDCheckout2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rDCheckout);
        expect(expectedResult).toContain(rDCheckout2);
      });

      it('should accept null and undefined values', () => {
        const rDCheckout: IRDCheckout = sampleWithRequiredData;
        expectedResult = service.addRDCheckoutToCollectionIfMissing([], null, rDCheckout, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rDCheckout);
      });

      it('should return initial array if no RDCheckout is added', () => {
        const rDCheckoutCollection: IRDCheckout[] = [sampleWithRequiredData];
        expectedResult = service.addRDCheckoutToCollectionIfMissing(rDCheckoutCollection, undefined, null);
        expect(expectedResult).toEqual(rDCheckoutCollection);
      });
    });

    describe('compareRDCheckout', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRDCheckout(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
        const entity2 = null;

        const compareResult1 = service.compareRDCheckout(entity1, entity2);
        const compareResult2 = service.compareRDCheckout(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
        const entity2 = { id: 'e7e5a93d-b28f-4946-b416-8e9de1cc51c1' };

        const compareResult1 = service.compareRDCheckout(entity1, entity2);
        const compareResult2 = service.compareRDCheckout(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
        const entity2 = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };

        const compareResult1 = service.compareRDCheckout(entity1, entity2);
        const compareResult2 = service.compareRDCheckout(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
