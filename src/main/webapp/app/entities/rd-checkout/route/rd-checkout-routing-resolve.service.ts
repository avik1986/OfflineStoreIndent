import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRDCheckout } from '../rd-checkout.model';
import { RDCheckoutService } from '../service/rd-checkout.service';

const rDCheckoutResolve = (route: ActivatedRouteSnapshot): Observable<null | IRDCheckout> => {
  const id = route.params.id;
  if (id) {
    return inject(RDCheckoutService)
      .find(id)
      .pipe(
        mergeMap((rDCheckout: HttpResponse<IRDCheckout>) => {
          if (rDCheckout.body) {
            return of(rDCheckout.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default rDCheckoutResolve;
