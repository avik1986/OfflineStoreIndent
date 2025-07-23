import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIntent } from '../intent.model';
import { IntentService } from '../service/intent.service';

const intentResolve = (route: ActivatedRouteSnapshot): Observable<null | IIntent> => {
  const id = route.params.id;
  if (id) {
    return inject(IntentService)
      .find(id)
      .pipe(
        mergeMap((intent: HttpResponse<IIntent>) => {
          if (intent.body) {
            return of(intent.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default intentResolve;
