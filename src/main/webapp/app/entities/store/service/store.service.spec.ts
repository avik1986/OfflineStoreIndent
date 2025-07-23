import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IStore } from '../store.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../store.test-samples';

import { StoreService } from './store.service';

const requireRestSample: IStore = {
  ...sampleWithRequiredData,
};

describe('Store Service', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;
  let expectedResult: IStore | IStore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Store', () => {
      const store = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(store).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Store', () => {
      const store = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(store).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Store', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Store', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Store', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStoreToCollectionIfMissing', () => {
      it('should add a Store to an empty array', () => {
        const store: IStore = sampleWithRequiredData;
        expectedResult = service.addStoreToCollectionIfMissing([], store);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(store);
      });

      it('should not add a Store to an array that contains it', () => {
        const store: IStore = sampleWithRequiredData;
        const storeCollection: IStore[] = [
          {
            ...store,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Store to an array that doesn't contain it", () => {
        const store: IStore = sampleWithRequiredData;
        const storeCollection: IStore[] = [sampleWithPartialData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(store);
      });

      it('should add only unique Store to an array', () => {
        const storeArray: IStore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const storeCollection: IStore[] = [sampleWithRequiredData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, ...storeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const store: IStore = sampleWithRequiredData;
        const store2: IStore = sampleWithPartialData;
        expectedResult = service.addStoreToCollectionIfMissing([], store, store2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(store);
        expect(expectedResult).toContain(store2);
      });

      it('should accept null and undefined values', () => {
        const store: IStore = sampleWithRequiredData;
        expectedResult = service.addStoreToCollectionIfMissing([], null, store, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(store);
      });

      it('should return initial array if no Store is added', () => {
        const storeCollection: IStore[] = [sampleWithRequiredData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, undefined, null);
        expect(expectedResult).toEqual(storeCollection);
      });
    });

    describe('compareStore', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
        const entity2 = null;

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
        const entity2 = { id: '9cf1d135-42dd-4c1a-a97a-5619d2716dee' };

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
        const entity2 = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
