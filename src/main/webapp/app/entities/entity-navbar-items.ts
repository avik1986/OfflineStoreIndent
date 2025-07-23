import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Article',
    route: '/article',
    translationKey: 'global.menu.entities.article',
  },
  {
    name: 'StoreManager',
    route: '/store-manager',
    translationKey: 'global.menu.entities.storeManager',
  },
  {
    name: 'Store',
    route: '/store',
    translationKey: 'global.menu.entities.store',
  },
  {
    name: 'Coupon',
    route: '/coupon',
    translationKey: 'global.menu.entities.coupon',
  },
  {
    name: 'RDCheckout',
    route: '/rd-checkout',
    translationKey: 'global.menu.entities.rDCheckout',
  },
  {
    name: 'Intent',
    route: '/intent',
    translationKey: 'global.menu.entities.intent',
  },
];
