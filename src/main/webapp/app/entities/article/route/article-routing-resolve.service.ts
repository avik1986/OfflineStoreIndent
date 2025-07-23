import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArticle } from '../article.model';
import { ArticleService } from '../service/article.service';

const articleResolve = (route: ActivatedRouteSnapshot): Observable<null | IArticle> => {
  const id = route.params.id;
  if (id) {
    return inject(ArticleService)
      .find(id)
      .pipe(
        mergeMap((article: HttpResponse<IArticle>) => {
          if (article.body) {
            return of(article.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default articleResolve;
