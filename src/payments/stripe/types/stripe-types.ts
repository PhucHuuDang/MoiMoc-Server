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
export type OrderValuesType = {
  user: {
    id: number;
    name: string;
    email: string | null;
    phoneAuth: string;
    avatar: string;
    role: string; // Enum for possible roles
  };
  address: string;
  phone: string;
  method: string; // Refine if specific values are expected (e.g. "standard", "express")
  paymentMethod: string; // Refine if specific payment methods are expected
  products: {
    productId: number;
    price: string; // Keeping price as string, can change to number if needed
    discountPrice: string | null; // Nullable discount price
    productName: string;
    productDescription: string;
    imageUrl: string;
    quantityOrder: number;
  }[];
  discountCode?: string | undefined;
};
