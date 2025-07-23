import dayjs from 'dayjs/esm';
import { IArticle } from 'app/entities/article/article.model';
import { IUser } from 'app/entities/user/user.model';
import { IStoreManager } from 'app/entities/store-manager/store-manager.model';
import { IStore } from 'app/entities/store/store.model';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { IRDCheckout } from 'app/entities/rd-checkout/rd-checkout.model';

export interface IIntent {
  id: string;
  commission?: number | null;
  createdTime?: dayjs.Dayjs | null;
  createdBy?: string | null;
  updatedTime?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  article?: IArticle | null;
  user?: Pick<IUser, 'id'> | null;
  storeManager?: IStoreManager | null;
  store?: IStore | null;
  coupon?: ICoupon | null;
  rdCheckout?: IRDCheckout | null;
}

export type NewIntent = Omit<IIntent, 'id'> & { id: null };
