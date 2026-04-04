export interface SaleItem {
  productId: string | {
    _id: string;
    name: string;
  };
  productName?: string;
  quantity: number;
  price: number;
}

export interface SaleTypes {
  _id?: string;
  items: SaleItem[];
  totalAmount: number;
  customerName: string;
  date: string | Date;
}

export type SaleFormValues = {
  items: {
    productId: string;
    quantity: number;
    price: number;
    _tempName: string;
  }[];
  customerName: string;
  date: string;
};
