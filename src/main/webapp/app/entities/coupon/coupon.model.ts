import { CouponType } from 'app/entities/enumerations/coupon-type.model';

export interface ICoupon {
  id: string;
  text?: string | null;
  type?: keyof typeof CouponType | null;
  value?: number | null;
}

export type NewCoupon = Omit<ICoupon, 'id'> & { id: null };
