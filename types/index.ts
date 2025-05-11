export interface Item {
  id?: string;
  name: string;
  description: string;
  units: number;
  buyingPrice: number;
  sellingPrice: number;
  imageUrl: string;
  createdAt: Date | string;
}

export interface Sale {
  id?: string;
  itemId: string;
  itemName: string;
  itemImageUrl: string;
  description: string;
  quantity: number;
  sellingPrice: number;
  paymentMethod: 'mpesa' | 'cash';
  createdAt: Date | string;
}

export type PaymentMethod = 'mpesa' | 'cash';
