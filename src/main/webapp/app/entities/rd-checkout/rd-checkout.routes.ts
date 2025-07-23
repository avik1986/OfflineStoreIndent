import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import RDCheckoutResolve from './route/rd-checkout-routing-resolve.service';

const rDCheckoutRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/rd-checkout.component').then(m => m.RDCheckoutComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/rd-checkout-detail.component').then(m => m.RDCheckoutDetailComponent),
    resolve: {
      rDCheckout: RDCheckoutResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/rd-checkout-update.component').then(m => m.RDCheckoutUpdateComponent),
    resolve: {
      rDCheckout: RDCheckoutResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/rd-checkout-update.component').then(m => m.RDCheckoutUpdateComponent),
    resolve: {
      rDCheckout: RDCheckoutResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rDCheckoutRoute;
