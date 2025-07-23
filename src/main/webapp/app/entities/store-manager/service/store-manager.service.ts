import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStoreManager, NewStoreManager } from '../store-manager.model';

export type PartialUpdateStoreManager = Partial<IStoreManager> & Pick<IStoreManager, 'id'>;

export type EntityResponseType = HttpResponse<IStoreManager>;
export type EntityArrayResponseType = HttpResponse<IStoreManager[]>;

@Injectable({ providedIn: 'root' })
export class StoreManagerService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/store-managers');

  create(storeManager: NewStoreManager): Observable<EntityResponseType> {
    return this.http.post<IStoreManager>(this.resourceUrl, storeManager, { observe: 'response' });
  }

  update(storeManager: IStoreManager): Observable<EntityResponseType> {
    return this.http.put<IStoreManager>(`${this.resourceUrl}/${this.getStoreManagerIdentifier(storeManager)}`, storeManager, {
      observe: 'response',
    });
  }

  partialUpdate(storeManager: PartialUpdateStoreManager): Observable<EntityResponseType> {
    return this.http.patch<IStoreManager>(`${this.resourceUrl}/${this.getStoreManagerIdentifier(storeManager)}`, storeManager, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IStoreManager>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStoreManager[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStoreManagerIdentifier(storeManager: Pick<IStoreManager, 'id'>): string {
    return storeManager.id;
  }

  compareStoreManager(o1: Pick<IStoreManager, 'id'> | null, o2: Pick<IStoreManager, 'id'> | null): boolean {
    return o1 && o2 ? this.getStoreManagerIdentifier(o1) === this.getStoreManagerIdentifier(o2) : o1 === o2;
  }

  addStoreManagerToCollectionIfMissing<Type extends Pick<IStoreManager, 'id'>>(
    storeManagerCollection: Type[],
    ...storeManagersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const storeManagers: Type[] = storeManagersToCheck.filter(isPresent);
    if (storeManagers.length > 0) {
      const storeManagerCollectionIdentifiers = storeManagerCollection.map(storeManagerItem =>
        this.getStoreManagerIdentifier(storeManagerItem),
      );
      const storeManagersToAdd = storeManagers.filter(storeManagerItem => {
        const storeManagerIdentifier = this.getStoreManagerIdentifier(storeManagerItem);
        if (storeManagerCollectionIdentifiers.includes(storeManagerIdentifier)) {
          return false;
        }
        storeManagerCollectionIdentifiers.push(storeManagerIdentifier);
        return true;
      });
      return [...storeManagersToAdd, ...storeManagerCollection];
    }
    return storeManagerCollection;
  }
}
