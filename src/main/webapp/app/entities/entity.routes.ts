import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'intentApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'article',
    data: { pageTitle: 'intentApp.article.home.title' },
    loadChildren: () => import('./article/article.routes'),
  },
  {
    path: 'store-manager',
    data: { pageTitle: 'intentApp.storeManager.home.title' },
    loadChildren: () => import('./store-manager/store-manager.routes'),
  },
  {
    path: 'store',
    data: { pageTitle: 'intentApp.store.home.title' },
    loadChildren: () => import('./store/store.routes'),
  },
  {
    path: 'coupon',
    data: { pageTitle: 'intentApp.coupon.home.title' },
    loadChildren: () => import('./coupon/coupon.routes'),
  },
  {
    path: 'rd-checkout',
    data: { pageTitle: 'intentApp.rDCheckout.home.title' },
    loadChildren: () => import('./rd-checkout/rd-checkout.routes'),
  },
  {
    path: 'intent',
    data: { pageTitle: 'intentApp.intent.home.title' },
    loadChildren: () => import('./intent/intent.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
