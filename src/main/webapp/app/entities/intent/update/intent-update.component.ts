import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { IntentService } from '../service/intent.service';
import { IIntent } from '../intent.model';
import { IntentFormGroup, IntentFormService } from './intent-form.service';

@Component({
  selector: 'jhi-intent-update',
  templateUrl: './intent-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class IntentUpdateComponent implements OnInit {
  isSaving = false;
  intent: IIntent | null = null;

  articlesSharedCollection: IArticle[] = [];
  usersSharedCollection: IUser[] = [];
  storeManagersSharedCollection: IStoreManager[] = [];
  storesSharedCollection: IStore[] = [];
  couponsSharedCollection: ICoupon[] = [];
  rDCheckoutsSharedCollection: IRDCheckout[] = [];

  protected intentService = inject(IntentService);
  protected intentFormService = inject(IntentFormService);
  protected articleService = inject(ArticleService);
  protected userService = inject(UserService);
  protected storeManagerService = inject(StoreManagerService);
  protected storeService = inject(StoreService);
  protected couponService = inject(CouponService);
  protected rDCheckoutService = inject(RDCheckoutService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: IntentFormGroup = this.intentFormService.createIntentFormGroup();

  compareArticle = (o1: IArticle | null, o2: IArticle | null): boolean => this.articleService.compareArticle(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareStoreManager = (o1: IStoreManager | null, o2: IStoreManager | null): boolean =>
    this.storeManagerService.compareStoreManager(o1, o2);

  compareStore = (o1: IStore | null, o2: IStore | null): boolean => this.storeService.compareStore(o1, o2);

  compareCoupon = (o1: ICoupon | null, o2: ICoupon | null): boolean => this.couponService.compareCoupon(o1, o2);

  compareRDCheckout = (o1: IRDCheckout | null, o2: IRDCheckout | null): boolean => this.rDCheckoutService.compareRDCheckout(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intent }) => {
      this.intent = intent;
      if (intent) {
        this.updateForm(intent);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const intent = this.intentFormService.getIntent(this.editForm);
    if (intent.id !== null) {
      this.subscribeToSaveResponse(this.intentService.update(intent));
    } else {
      this.subscribeToSaveResponse(this.intentService.create(intent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(intent: IIntent): void {
    this.intent = intent;
    this.intentFormService.resetForm(this.editForm, intent);

    this.articlesSharedCollection = this.articleService.addArticleToCollectionIfMissing<IArticle>(
      this.articlesSharedCollection,
      intent.article,
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, intent.user);
    this.storeManagersSharedCollection = this.storeManagerService.addStoreManagerToCollectionIfMissing<IStoreManager>(
      this.storeManagersSharedCollection,
      intent.storeManager,
    );
    this.storesSharedCollection = this.storeService.addStoreToCollectionIfMissing<IStore>(this.storesSharedCollection, intent.store);
    this.couponsSharedCollection = this.couponService.addCouponToCollectionIfMissing<ICoupon>(this.couponsSharedCollection, intent.coupon);
    this.rDCheckoutsSharedCollection = this.rDCheckoutService.addRDCheckoutToCollectionIfMissing<IRDCheckout>(
      this.rDCheckoutsSharedCollection,
      intent.rdCheckout,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.articleService
      .query()
      .pipe(map((res: HttpResponse<IArticle[]>) => res.body ?? []))
      .pipe(map((articles: IArticle[]) => this.articleService.addArticleToCollectionIfMissing<IArticle>(articles, this.intent?.article)))
      .subscribe((articles: IArticle[]) => (this.articlesSharedCollection = articles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.intent?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.storeManagerService
      .query()
      .pipe(map((res: HttpResponse<IStoreManager[]>) => res.body ?? []))
      .pipe(
        map((storeManagers: IStoreManager[]) =>
          this.storeManagerService.addStoreManagerToCollectionIfMissing<IStoreManager>(storeManagers, this.intent?.storeManager),
        ),
      )
      .subscribe((storeManagers: IStoreManager[]) => (this.storeManagersSharedCollection = storeManagers));

    this.storeService
      .query()
      .pipe(map((res: HttpResponse<IStore[]>) => res.body ?? []))
      .pipe(map((stores: IStore[]) => this.storeService.addStoreToCollectionIfMissing<IStore>(stores, this.intent?.store)))
      .subscribe((stores: IStore[]) => (this.storesSharedCollection = stores));

    this.couponService
      .query()
      .pipe(map((res: HttpResponse<ICoupon[]>) => res.body ?? []))
      .pipe(map((coupons: ICoupon[]) => this.couponService.addCouponToCollectionIfMissing<ICoupon>(coupons, this.intent?.coupon)))
      .subscribe((coupons: ICoupon[]) => (this.couponsSharedCollection = coupons));

    this.rDCheckoutService
      .query()
      .pipe(map((res: HttpResponse<IRDCheckout[]>) => res.body ?? []))
      .pipe(
        map((rDCheckouts: IRDCheckout[]) =>
          this.rDCheckoutService.addRDCheckoutToCollectionIfMissing<IRDCheckout>(rDCheckouts, this.intent?.rdCheckout),
        ),
      )
      .subscribe((rDCheckouts: IRDCheckout[]) => (this.rDCheckoutsSharedCollection = rDCheckouts));
  }
}
