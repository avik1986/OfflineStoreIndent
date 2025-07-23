import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArticle, NewArticle } from '../article.model';

export type PartialUpdateArticle = Partial<IArticle> & Pick<IArticle, 'id'>;

export type EntityResponseType = HttpResponse<IArticle>;
export type EntityArrayResponseType = HttpResponse<IArticle[]>;

@Injectable({ providedIn: 'root' })
export class ArticleService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/articles');

  create(article: NewArticle): Observable<EntityResponseType> {
    return this.http.post<IArticle>(this.resourceUrl, article, { observe: 'response' });
  }

  update(article: IArticle): Observable<EntityResponseType> {
    return this.http.put<IArticle>(`${this.resourceUrl}/${this.getArticleIdentifier(article)}`, article, { observe: 'response' });
  }

  partialUpdate(article: PartialUpdateArticle): Observable<EntityResponseType> {
    return this.http.patch<IArticle>(`${this.resourceUrl}/${this.getArticleIdentifier(article)}`, article, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IArticle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArticle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getArticleIdentifier(article: Pick<IArticle, 'id'>): string {
    return article.id;
  }

  compareArticle(o1: Pick<IArticle, 'id'> | null, o2: Pick<IArticle, 'id'> | null): boolean {
    return o1 && o2 ? this.getArticleIdentifier(o1) === this.getArticleIdentifier(o2) : o1 === o2;
  }

  addArticleToCollectionIfMissing<Type extends Pick<IArticle, 'id'>>(
    articleCollection: Type[],
    ...articlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const articles: Type[] = articlesToCheck.filter(isPresent);
    if (articles.length > 0) {
      const articleCollectionIdentifiers = articleCollection.map(articleItem => this.getArticleIdentifier(articleItem));
      const articlesToAdd = articles.filter(articleItem => {
        const articleIdentifier = this.getArticleIdentifier(articleItem);
        if (articleCollectionIdentifiers.includes(articleIdentifier)) {
          return false;
        }
        articleCollectionIdentifiers.push(articleIdentifier);
        return true;
      });
      return [...articlesToAdd, ...articleCollection];
    }
    return articleCollection;
  }
}
