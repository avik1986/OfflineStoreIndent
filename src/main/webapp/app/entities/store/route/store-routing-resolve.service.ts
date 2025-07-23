import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStore } from '../store.model';
import { StoreService } from '../service/store.service';

const storeResolve = (route: ActivatedRouteSnapshot): Observable<null | IStore> => {
  const id = route.params.id;
  if (id) {
    return inject(StoreService)
      .find(id)
      .pipe(
        mergeMap((store: HttpResponse<IStore>) => {
          if (store.body) {
            return of(store.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default storeResolve;
