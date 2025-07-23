import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStoreManager } from '../store-manager.model';
import { StoreManagerService } from '../service/store-manager.service';

const storeManagerResolve = (route: ActivatedRouteSnapshot): Observable<null | IStoreManager> => {
  const id = route.params.id;
  if (id) {
    return inject(StoreManagerService)
      .find(id)
      .pipe(
        mergeMap((storeManager: HttpResponse<IStoreManager>) => {
          if (storeManager.body) {
            return of(storeManager.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default storeManagerResolve;
