import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import IntentResolve from './route/intent-routing-resolve.service';

const intentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/intent.component').then(m => m.IntentComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/intent-detail.component').then(m => m.IntentDetailComponent),
    resolve: {
      intent: IntentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/intent-update.component').then(m => m.IntentUpdateComponent),
    resolve: {
      intent: IntentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/intent-update.component').then(m => m.IntentUpdateComponent),
    resolve: {
      intent: IntentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default intentRoute;
