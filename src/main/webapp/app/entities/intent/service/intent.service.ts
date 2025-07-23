import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIntent, NewIntent } from '../intent.model';

export type PartialUpdateIntent = Partial<IIntent> & Pick<IIntent, 'id'>;

type RestOf<T extends IIntent | NewIntent> = Omit<T, 'createdTime' | 'updatedTime'> & {
  createdTime?: string | null;
  updatedTime?: string | null;
};

export type RestIntent = RestOf<IIntent>;

export type NewRestIntent = RestOf<NewIntent>;

export type PartialUpdateRestIntent = RestOf<PartialUpdateIntent>;

export type EntityResponseType = HttpResponse<IIntent>;
export type EntityArrayResponseType = HttpResponse<IIntent[]>;

@Injectable({ providedIn: 'root' })
export class IntentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/intents');

  create(intent: NewIntent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(intent);
    return this.http
      .post<RestIntent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(intent: IIntent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(intent);
    return this.http
      .put<RestIntent>(`${this.resourceUrl}/${this.getIntentIdentifier(intent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(intent: PartialUpdateIntent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(intent);
    return this.http
      .patch<RestIntent>(`${this.resourceUrl}/${this.getIntentIdentifier(intent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestIntent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestIntent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIntentIdentifier(intent: Pick<IIntent, 'id'>): string {
    return intent.id;
  }

  compareIntent(o1: Pick<IIntent, 'id'> | null, o2: Pick<IIntent, 'id'> | null): boolean {
    return o1 && o2 ? this.getIntentIdentifier(o1) === this.getIntentIdentifier(o2) : o1 === o2;
  }

  addIntentToCollectionIfMissing<Type extends Pick<IIntent, 'id'>>(
    intentCollection: Type[],
    ...intentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const intents: Type[] = intentsToCheck.filter(isPresent);
    if (intents.length > 0) {
      const intentCollectionIdentifiers = intentCollection.map(intentItem => this.getIntentIdentifier(intentItem));
      const intentsToAdd = intents.filter(intentItem => {
        const intentIdentifier = this.getIntentIdentifier(intentItem);
        if (intentCollectionIdentifiers.includes(intentIdentifier)) {
          return false;
        }
        intentCollectionIdentifiers.push(intentIdentifier);
        return true;
      });
      return [...intentsToAdd, ...intentCollection];
    }
    return intentCollection;
  }

  protected convertDateFromClient<T extends IIntent | NewIntent | PartialUpdateIntent>(intent: T): RestOf<T> {
    return {
      ...intent,
      createdTime: intent.createdTime?.toJSON() ?? null,
      updatedTime: intent.updatedTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restIntent: RestIntent): IIntent {
    return {
      ...restIntent,
      createdTime: restIntent.createdTime ? dayjs(restIntent.createdTime) : undefined,
      updatedTime: restIntent.updatedTime ? dayjs(restIntent.updatedTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestIntent>): HttpResponse<IIntent> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestIntent[]>): HttpResponse<IIntent[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
