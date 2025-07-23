import { IRDCheckout, NewRDCheckout } from './rd-checkout.model';

export const sampleWithRequiredData: IRDCheckout = {
  id: 'a145f7e2-a5f5-40ab-bc0c-aba5d230cf00',
};

export const sampleWithPartialData: IRDCheckout = {
  id: '4a81a4a2-4fd1-4231-b51e-289749507eac',
  orderDeliveryStatus: 'far ugh oh',
};

export const sampleWithFullData: IRDCheckout = {
  id: 'cff5f8fc-244b-41a2-9fe0-e286700df9ea',
  status: 'after',
  paymentStatus: 'recent because whimsical',
  orderId: 'widow',
  orderDeliveryStatus: 'yuck cauliflower majestically',
};

export const sampleWithNewData: NewRDCheckout = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
