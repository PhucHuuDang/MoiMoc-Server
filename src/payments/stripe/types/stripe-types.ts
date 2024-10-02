export type ProductValuesType = {
  productName: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
};

export type PaymentValuesTypes = {
  userId: number;
  paymentMethodId: number;
  deliveryMethodId: number;
  discountCode?: string;

  products: {
    productId: number;
    quantity: number;
  }[];
};
