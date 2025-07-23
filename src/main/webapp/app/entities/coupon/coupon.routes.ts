import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import CouponResolve from './route/coupon-routing-resolve.service';

const couponRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/coupon.component').then(m => m.CouponComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/coupon-detail.component').then(m => m.CouponDetailComponent),
    resolve: {
      coupon: CouponResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/coupon-update.component').then(m => m.CouponUpdateComponent),
    resolve: {
      coupon: CouponResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/coupon-update.component').then(m => m.CouponUpdateComponent),
    resolve: {
      coupon: CouponResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default couponRoute;
