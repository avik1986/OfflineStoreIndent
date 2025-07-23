import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IStoreManager } from '../store-manager.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../store-manager.test-samples';

import { StoreManagerService } from './store-manager.service';

const requireRestSample: IStoreManager = {
  ...sampleWithRequiredData,
};

describe('StoreManager Service', () => {
  let service: StoreManagerService;
  let httpMock: HttpTestingController;
  let expectedResult: IStoreManager | IStoreManager[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StoreManagerService);
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

    it('should create a StoreManager', () => {
      const storeManager = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(storeManager).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StoreManager', () => {
      const storeManager = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(storeManager).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StoreManager', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StoreManager', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StoreManager', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStoreManagerToCollectionIfMissing', () => {
      it('should add a StoreManager to an empty array', () => {
        const storeManager: IStoreManager = sampleWithRequiredData;
        expectedResult = service.addStoreManagerToCollectionIfMissing([], storeManager);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeManager);
      });

      it('should not add a StoreManager to an array that contains it', () => {
        const storeManager: IStoreManager = sampleWithRequiredData;
        const storeManagerCollection: IStoreManager[] = [
          {
            ...storeManager,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStoreManagerToCollectionIfMissing(storeManagerCollection, storeManager);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StoreManager to an array that doesn't contain it", () => {
        const storeManager: IStoreManager = sampleWithRequiredData;
        const storeManagerCollection: IStoreManager[] = [sampleWithPartialData];
        expectedResult = service.addStoreManagerToCollectionIfMissing(storeManagerCollection, storeManager);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeManager);
      });

      it('should add only unique StoreManager to an array', () => {
        const storeManagerArray: IStoreManager[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const storeManagerCollection: IStoreManager[] = [sampleWithRequiredData];
        expectedResult = service.addStoreManagerToCollectionIfMissing(storeManagerCollection, ...storeManagerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const storeManager: IStoreManager = sampleWithRequiredData;
        const storeManager2: IStoreManager = sampleWithPartialData;
        expectedResult = service.addStoreManagerToCollectionIfMissing([], storeManager, storeManager2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeManager);
        expect(expectedResult).toContain(storeManager2);
      });

      it('should accept null and undefined values', () => {
        const storeManager: IStoreManager = sampleWithRequiredData;
        expectedResult = service.addStoreManagerToCollectionIfMissing([], null, storeManager, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeManager);
      });

      it('should return initial array if no StoreManager is added', () => {
        const storeManagerCollection: IStoreManager[] = [sampleWithRequiredData];
        expectedResult = service.addStoreManagerToCollectionIfMissing(storeManagerCollection, undefined, null);
        expect(expectedResult).toEqual(storeManagerCollection);
      });
    });

    describe('compareStoreManager', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStoreManager(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
        const entity2 = null;

        const compareResult1 = service.compareStoreManager(entity1, entity2);
        const compareResult2 = service.compareStoreManager(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
        const entity2 = { id: '17d79568-cef7-4bd9-9557-ac1486320f2f' };

        const compareResult1 = service.compareStoreManager(entity1, entity2);
        const compareResult2 = service.compareStoreManager(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
        const entity2 = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };

        const compareResult1 = service.compareStoreManager(entity1, entity2);
        const compareResult2 = service.compareStoreManager(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
