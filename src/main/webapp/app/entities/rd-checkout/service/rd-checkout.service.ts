import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRDCheckout, NewRDCheckout } from '../rd-checkout.model';

export type PartialUpdateRDCheckout = Partial<IRDCheckout> & Pick<IRDCheckout, 'id'>;

export type EntityResponseType = HttpResponse<IRDCheckout>;
export type EntityArrayResponseType = HttpResponse<IRDCheckout[]>;

@Injectable({ providedIn: 'root' })
export class RDCheckoutService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rd-checkouts');

  create(rDCheckout: NewRDCheckout): Observable<EntityResponseType> {
    return this.http.post<IRDCheckout>(this.resourceUrl, rDCheckout, { observe: 'response' });
  }

  update(rDCheckout: IRDCheckout): Observable<EntityResponseType> {
    return this.http.put<IRDCheckout>(`${this.resourceUrl}/${this.getRDCheckoutIdentifier(rDCheckout)}`, rDCheckout, {
      observe: 'response',
    });
  }

  partialUpdate(rDCheckout: PartialUpdateRDCheckout): Observable<EntityResponseType> {
    return this.http.patch<IRDCheckout>(`${this.resourceUrl}/${this.getRDCheckoutIdentifier(rDCheckout)}`, rDCheckout, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IRDCheckout>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRDCheckout[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRDCheckoutIdentifier(rDCheckout: Pick<IRDCheckout, 'id'>): string {
    return rDCheckout.id;
  }

  compareRDCheckout(o1: Pick<IRDCheckout, 'id'> | null, o2: Pick<IRDCheckout, 'id'> | null): boolean {
    return o1 && o2 ? this.getRDCheckoutIdentifier(o1) === this.getRDCheckoutIdentifier(o2) : o1 === o2;
  }

  addRDCheckoutToCollectionIfMissing<Type extends Pick<IRDCheckout, 'id'>>(
    rDCheckoutCollection: Type[],
    ...rDCheckoutsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rDCheckouts: Type[] = rDCheckoutsToCheck.filter(isPresent);
    if (rDCheckouts.length > 0) {
      const rDCheckoutCollectionIdentifiers = rDCheckoutCollection.map(rDCheckoutItem => this.getRDCheckoutIdentifier(rDCheckoutItem));
      const rDCheckoutsToAdd = rDCheckouts.filter(rDCheckoutItem => {
        const rDCheckoutIdentifier = this.getRDCheckoutIdentifier(rDCheckoutItem);
        if (rDCheckoutCollectionIdentifiers.includes(rDCheckoutIdentifier)) {
          return false;
        }
        rDCheckoutCollectionIdentifiers.push(rDCheckoutIdentifier);
        return true;
      });
      return [...rDCheckoutsToAdd, ...rDCheckoutCollection];
    }
    return rDCheckoutCollection;
  }
}
