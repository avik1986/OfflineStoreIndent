import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import StoreResolve from './route/store-routing-resolve.service';

const storeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/store.component').then(m => m.StoreComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/store-detail.component').then(m => m.StoreDetailComponent),
    resolve: {
      store: StoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/store-update.component').then(m => m.StoreUpdateComponent),
    resolve: {
      store: StoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/store-update.component').then(m => m.StoreUpdateComponent),
    resolve: {
      store: StoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default storeRoute;
