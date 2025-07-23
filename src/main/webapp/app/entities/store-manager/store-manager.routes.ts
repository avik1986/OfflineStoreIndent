import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import StoreManagerResolve from './route/store-manager-routing-resolve.service';

const storeManagerRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/store-manager.component').then(m => m.StoreManagerComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/store-manager-detail.component').then(m => m.StoreManagerDetailComponent),
    resolve: {
      storeManager: StoreManagerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/store-manager-update.component').then(m => m.StoreManagerUpdateComponent),
    resolve: {
      storeManager: StoreManagerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/store-manager-update.component').then(m => m.StoreManagerUpdateComponent),
    resolve: {
      storeManager: StoreManagerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default storeManagerRoute;
