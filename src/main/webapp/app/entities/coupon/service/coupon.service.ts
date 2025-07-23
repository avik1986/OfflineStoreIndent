import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICoupon, NewCoupon } from '../coupon.model';

export type PartialUpdateCoupon = Partial<ICoupon> & Pick<ICoupon, 'id'>;

export type EntityResponseType = HttpResponse<ICoupon>;
export type EntityArrayResponseType = HttpResponse<ICoupon[]>;

@Injectable({ providedIn: 'root' })
export class CouponService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/coupons');

  create(coupon: NewCoupon): Observable<EntityResponseType> {
    return this.http.post<ICoupon>(this.resourceUrl, coupon, { observe: 'response' });
  }

  update(coupon: ICoupon): Observable<EntityResponseType> {
    return this.http.put<ICoupon>(`${this.resourceUrl}/${this.getCouponIdentifier(coupon)}`, coupon, { observe: 'response' });
  }

  partialUpdate(coupon: PartialUpdateCoupon): Observable<EntityResponseType> {
    return this.http.patch<ICoupon>(`${this.resourceUrl}/${this.getCouponIdentifier(coupon)}`, coupon, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICoupon>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICoupon[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCouponIdentifier(coupon: Pick<ICoupon, 'id'>): string {
    return coupon.id;
  }

  compareCoupon(o1: Pick<ICoupon, 'id'> | null, o2: Pick<ICoupon, 'id'> | null): boolean {
    return o1 && o2 ? this.getCouponIdentifier(o1) === this.getCouponIdentifier(o2) : o1 === o2;
  }

  addCouponToCollectionIfMissing<Type extends Pick<ICoupon, 'id'>>(
    couponCollection: Type[],
    ...couponsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const coupons: Type[] = couponsToCheck.filter(isPresent);
    if (coupons.length > 0) {
      const couponCollectionIdentifiers = couponCollection.map(couponItem => this.getCouponIdentifier(couponItem));
      const couponsToAdd = coupons.filter(couponItem => {
        const couponIdentifier = this.getCouponIdentifier(couponItem);
        if (couponCollectionIdentifiers.includes(couponIdentifier)) {
          return false;
        }
        couponCollectionIdentifiers.push(couponIdentifier);
        return true;
      });
      return [...couponsToAdd, ...couponCollection];
    }
    return couponCollection;
  }
}
