import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IStoreManager } from 'app/entities/store-manager/store-manager.model';
import { StoreManagerService } from 'app/entities/store-manager/service/store-manager.service';
import { IStore } from 'app/entities/store/store.model';
import { StoreService } from 'app/entities/store/service/store.service';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { CouponService } from 'app/entities/coupon/service/coupon.service';
import { IRDCheckout } from 'app/entities/rd-checkout/rd-checkout.model';
import { RDCheckoutService } from 'app/entities/rd-checkout/service/rd-checkout.service';
import { IIntent } from '../intent.model';
import { IntentService } from '../service/intent.service';
import { IntentFormService } from './intent-form.service';

import { IntentUpdateComponent } from './intent-update.component';

describe('Intent Management Update Component', () => {
  let comp: IntentUpdateComponent;
  let fixture: ComponentFixture<IntentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let intentFormService: IntentFormService;
  let intentService: IntentService;
  let articleService: ArticleService;
  let userService: UserService;
  let storeManagerService: StoreManagerService;
  let storeService: StoreService;
  let couponService: CouponService;
  let rDCheckoutService: RDCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IntentUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IntentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IntentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    intentFormService = TestBed.inject(IntentFormService);
    intentService = TestBed.inject(IntentService);
    articleService = TestBed.inject(ArticleService);
    userService = TestBed.inject(UserService);
    storeManagerService = TestBed.inject(StoreManagerService);
    storeService = TestBed.inject(StoreService);
    couponService = TestBed.inject(CouponService);
    rDCheckoutService = TestBed.inject(RDCheckoutService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Article query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const article: IArticle = { id: 'be05381e-70bd-46bf-98c6-db6a9c69d1fe' };
      intent.article = article;

      const articleCollection: IArticle[] = [{ id: 'be05381e-70bd-46bf-98c6-db6a9c69d1fe' }];
      jest.spyOn(articleService, 'query').mockReturnValue(of(new HttpResponse({ body: articleCollection })));
      const additionalArticles = [article];
      const expectedCollection: IArticle[] = [...additionalArticles, ...articleCollection];
      jest.spyOn(articleService, 'addArticleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(articleService.query).toHaveBeenCalled();
      expect(articleService.addArticleToCollectionIfMissing).toHaveBeenCalledWith(
        articleCollection,
        ...additionalArticles.map(expect.objectContaining),
      );
      expect(comp.articlesSharedCollection).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const user: IUser = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
      intent.user = user;

      const userCollection: IUser[] = [{ id: '1344246c-16a7-46d1-bb61-2043f965c8d5' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should call StoreManager query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const storeManager: IStoreManager = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
      intent.storeManager = storeManager;

      const storeManagerCollection: IStoreManager[] = [{ id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' }];
      jest.spyOn(storeManagerService, 'query').mockReturnValue(of(new HttpResponse({ body: storeManagerCollection })));
      const additionalStoreManagers = [storeManager];
      const expectedCollection: IStoreManager[] = [...additionalStoreManagers, ...storeManagerCollection];
      jest.spyOn(storeManagerService, 'addStoreManagerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(storeManagerService.query).toHaveBeenCalled();
      expect(storeManagerService.addStoreManagerToCollectionIfMissing).toHaveBeenCalledWith(
        storeManagerCollection,
        ...additionalStoreManagers.map(expect.objectContaining),
      );
      expect(comp.storeManagersSharedCollection).toEqual(expectedCollection);
    });

    it('should call Store query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const store: IStore = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
      intent.store = store;

      const storeCollection: IStore[] = [{ id: '1d725fc9-527e-43ab-bb61-c31c85115fca' }];
      jest.spyOn(storeService, 'query').mockReturnValue(of(new HttpResponse({ body: storeCollection })));
      const additionalStores = [store];
      const expectedCollection: IStore[] = [...additionalStores, ...storeCollection];
      jest.spyOn(storeService, 'addStoreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(storeService.query).toHaveBeenCalled();
      expect(storeService.addStoreToCollectionIfMissing).toHaveBeenCalledWith(
        storeCollection,
        ...additionalStores.map(expect.objectContaining),
      );
      expect(comp.storesSharedCollection).toEqual(expectedCollection);
    });

    it('should call Coupon query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const coupon: ICoupon = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
      intent.coupon = coupon;

      const couponCollection: ICoupon[] = [{ id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' }];
      jest.spyOn(couponService, 'query').mockReturnValue(of(new HttpResponse({ body: couponCollection })));
      const additionalCoupons = [coupon];
      const expectedCollection: ICoupon[] = [...additionalCoupons, ...couponCollection];
      jest.spyOn(couponService, 'addCouponToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(couponService.query).toHaveBeenCalled();
      expect(couponService.addCouponToCollectionIfMissing).toHaveBeenCalledWith(
        couponCollection,
        ...additionalCoupons.map(expect.objectContaining),
      );
      expect(comp.couponsSharedCollection).toEqual(expectedCollection);
    });

    it('should call RDCheckout query and add missing value', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const rdCheckout: IRDCheckout = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
      intent.rdCheckout = rdCheckout;

      const rDCheckoutCollection: IRDCheckout[] = [{ id: '8901de36-fe45-4be2-ba21-04ced2582ff4' }];
      jest.spyOn(rDCheckoutService, 'query').mockReturnValue(of(new HttpResponse({ body: rDCheckoutCollection })));
      const additionalRDCheckouts = [rdCheckout];
      const expectedCollection: IRDCheckout[] = [...additionalRDCheckouts, ...rDCheckoutCollection];
      jest.spyOn(rDCheckoutService, 'addRDCheckoutToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(rDCheckoutService.query).toHaveBeenCalled();
      expect(rDCheckoutService.addRDCheckoutToCollectionIfMissing).toHaveBeenCalledWith(
        rDCheckoutCollection,
        ...additionalRDCheckouts.map(expect.objectContaining),
      );
      expect(comp.rDCheckoutsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const intent: IIntent = { id: 'dca0c813-d513-4d32-9a80-30cd3b3f8365' };
      const article: IArticle = { id: 'be05381e-70bd-46bf-98c6-db6a9c69d1fe' };
      intent.article = article;
      const user: IUser = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
      intent.user = user;
      const storeManager: IStoreManager = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
      intent.storeManager = storeManager;
      const store: IStore = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
      intent.store = store;
      const coupon: ICoupon = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
      intent.coupon = coupon;
      const rdCheckout: IRDCheckout = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
      intent.rdCheckout = rdCheckout;

      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      expect(comp.articlesSharedCollection).toContainEqual(article);
      expect(comp.usersSharedCollection).toContainEqual(user);
      expect(comp.storeManagersSharedCollection).toContainEqual(storeManager);
      expect(comp.storesSharedCollection).toContainEqual(store);
      expect(comp.couponsSharedCollection).toContainEqual(coupon);
      expect(comp.rDCheckoutsSharedCollection).toContainEqual(rdCheckout);
      expect(comp.intent).toEqual(intent);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
      jest.spyOn(intentFormService, 'getIntent').mockReturnValue(intent);
      jest.spyOn(intentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intent }));
      saveSubject.complete();

      // THEN
      expect(intentFormService.getIntent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(intentService.update).toHaveBeenCalledWith(expect.objectContaining(intent));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
      jest.spyOn(intentFormService, 'getIntent').mockReturnValue({ id: null });
      jest.spyOn(intentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intent }));
      saveSubject.complete();

      // THEN
      expect(intentFormService.getIntent).toHaveBeenCalled();
      expect(intentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntent>>();
      const intent = { id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' };
      jest.spyOn(intentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(intentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareArticle', () => {
      it('should forward to articleService', () => {
        const entity = { id: 'be05381e-70bd-46bf-98c6-db6a9c69d1fe' };
        const entity2 = { id: '95abd217-e9fb-4450-a898-e65e44a7cbba' };
        jest.spyOn(articleService, 'compareArticle');
        comp.compareArticle(entity, entity2);
        expect(articleService.compareArticle).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
        const entity2 = { id: '1e61df13-b2d3-459d-875e-5607a4ccdbdb' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStoreManager', () => {
      it('should forward to storeManagerService', () => {
        const entity = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
        const entity2 = { id: '17d79568-cef7-4bd9-9557-ac1486320f2f' };
        jest.spyOn(storeManagerService, 'compareStoreManager');
        comp.compareStoreManager(entity, entity2);
        expect(storeManagerService.compareStoreManager).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStore', () => {
      it('should forward to storeService', () => {
        const entity = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
        const entity2 = { id: '9cf1d135-42dd-4c1a-a97a-5619d2716dee' };
        jest.spyOn(storeService, 'compareStore');
        comp.compareStore(entity, entity2);
        expect(storeService.compareStore).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCoupon', () => {
      it('should forward to couponService', () => {
        const entity = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
        const entity2 = { id: 'd2da5bdf-05f9-480b-ba8c-82307bde9d7c' };
        jest.spyOn(couponService, 'compareCoupon');
        comp.compareCoupon(entity, entity2);
        expect(couponService.compareCoupon).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRDCheckout', () => {
      it('should forward to rDCheckoutService', () => {
        const entity = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
        const entity2 = { id: 'e7e5a93d-b28f-4946-b416-8e9de1cc51c1' };
        jest.spyOn(rDCheckoutService, 'compareRDCheckout');
        comp.compareRDCheckout(entity, entity2);
        expect(rDCheckoutService.compareRDCheckout).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
