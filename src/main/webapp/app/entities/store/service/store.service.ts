import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStore, NewStore } from '../store.model';

export type PartialUpdateStore = Partial<IStore> & Pick<IStore, 'id'>;

export type EntityResponseType = HttpResponse<IStore>;
export type EntityArrayResponseType = HttpResponse<IStore[]>;

@Injectable({ providedIn: 'root' })
export class StoreService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stores');

  create(store: NewStore): Observable<EntityResponseType> {
    return this.http.post<IStore>(this.resourceUrl, store, { observe: 'response' });
  }

  update(store: IStore): Observable<EntityResponseType> {
    return this.http.put<IStore>(`${this.resourceUrl}/${this.getStoreIdentifier(store)}`, store, { observe: 'response' });
  }

  partialUpdate(store: PartialUpdateStore): Observable<EntityResponseType> {
    return this.http.patch<IStore>(`${this.resourceUrl}/${this.getStoreIdentifier(store)}`, store, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IStore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStoreIdentifier(store: Pick<IStore, 'id'>): string {
    return store.id;
  }

  compareStore(o1: Pick<IStore, 'id'> | null, o2: Pick<IStore, 'id'> | null): boolean {
    return o1 && o2 ? this.getStoreIdentifier(o1) === this.getStoreIdentifier(o2) : o1 === o2;
  }

  addStoreToCollectionIfMissing<Type extends Pick<IStore, 'id'>>(
    storeCollection: Type[],
    ...storesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stores: Type[] = storesToCheck.filter(isPresent);
    if (stores.length > 0) {
      const storeCollectionIdentifiers = storeCollection.map(storeItem => this.getStoreIdentifier(storeItem));
      const storesToAdd = stores.filter(storeItem => {
        const storeIdentifier = this.getStoreIdentifier(storeItem);
        if (storeCollectionIdentifiers.includes(storeIdentifier)) {
          return false;
        }
        storeCollectionIdentifiers.push(storeIdentifier);
        return true;
      });
      return [...storesToAdd, ...storeCollection];
    }
    return storeCollection;
  }
}
