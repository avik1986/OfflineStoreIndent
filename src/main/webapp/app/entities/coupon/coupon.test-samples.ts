import { ICoupon, NewCoupon } from './coupon.model';

export const sampleWithRequiredData: ICoupon = {
  id: 'd6befb7c-0071-459e-a5c1-4bbff21a5402',
};

export const sampleWithPartialData: ICoupon = {
  id: '2b04f211-7fa2-4b45-8da3-f8b62418a0da',
  type: 'FIXED',
  value: 4200.57,
};

export const sampleWithFullData: ICoupon = {
  id: 'b331d2f2-7d2d-4656-8160-24a30be8851e',
  text: 'brr vainly cripple',
  type: 'FIXED',
  value: 2269.93,
};

export const sampleWithNewData: NewCoupon = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
