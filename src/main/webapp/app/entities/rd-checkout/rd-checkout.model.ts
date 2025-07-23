export interface IRDCheckout {
  id: string;
  status?: string | null;
  paymentStatus?: string | null;
  orderId?: string | null;
  orderDeliveryStatus?: string | null;
}

export type NewRDCheckout = Omit<IRDCheckout, 'id'> & { id: null };
