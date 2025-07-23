import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import ArticleResolve from './route/article-routing-resolve.service';

const articleRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/article.component').then(m => m.ArticleComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/article-detail.component').then(m => m.ArticleDetailComponent),
    resolve: {
      article: ArticleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/article-update.component').then(m => m.ArticleUpdateComponent),
    resolve: {
      article: ArticleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/article-update.component').then(m => m.ArticleUpdateComponent),
    resolve: {
      article: ArticleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default articleRoute;
