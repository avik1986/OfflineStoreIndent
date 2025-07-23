import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IIntent } from '../intent.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../intent.test-samples';

import { IntentService, RestIntent } from './intent.service';

const requireRestSample: RestIntent = {
  ...sampleWithRequiredData,
  createdTime: sampleWithRequiredData.createdTime?.toJSON(),
  updatedTime: sampleWithRequiredData.updatedTime?.toJSON(),
};

describe('Intent Service', () => {
  let service: IntentService;
  let httpMock: HttpTestingController;
  let expectedResult: IIntent | IIntent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(IntentService);
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

    it('should create a Intent', () => {
      const intent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(intent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Intent', () => {
      const intent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(intent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Intent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Intent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Intent', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIntentToCollectionIfMissing', () => {
      it('should add a Intent to an empty array', () => {
        const intent: IIntent = sampleWithRequiredData;
        expectedResult = service.addIntentToCollectionIfMissing([], intent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intent);
      });

      it('should not add a Intent to an array that contains it', () => {
        const intent: IIntent = sampleWithRequiredData;
        const intentCollection: IIntent[] = [
          {
            ...intent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, intent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Intent to an array that doesn't contain it", () => {
        const intent: IIntent = sampleWithRequiredData;
        const intentCollection: IIntent[] = [sampleWithPartialData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, intent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intent);
      });

      it('should add only unique Intent to an array', () => {
        const intentArray: IIntent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const intentCollection: IIntent[] = [sampleWithRequiredData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, ...intentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const intent: IIntent = sampleWithRequiredData;
        const intent2: IIntent = sampleWithPartialData;
        expectedResult = service.addIntentToCollectionIfMissing([], intent, intent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intent);
        expect(expectedResult).toContain(intent2);
      });

      it('should accept null and undefined values', () => {
        const intent: IIntent = sampleWithRequiredData;
        expectedResult = service.addIntentToCollectionIfMissing([], null, intent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intent);
      });

      it('should return initial array if no Intent is added', () => {
        const intentCollection: IIntent[] = [sampleWithRequiredData];
        expectedResult = service.addIntentToCollectionIfMissing(intentCollection, undefined, null);
        expect(expectedResult).toEqual(intentCollection);
      });
    });

    describe('compareIntent', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIntent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
        const entity2 = null;

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
        const entity2 = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
        const entity2 = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };

        const compareResult1 = service.compareIntent(entity1, entity2);
        const compareResult2 = service.compareIntent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
