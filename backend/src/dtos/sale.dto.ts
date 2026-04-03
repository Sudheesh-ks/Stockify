export interface SaleItemDTO {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface SaleDTO {
  _id?: string;
  items: SaleItemDTO[];
  totalAmount: number;
  customerName: string;
  date: Date;
}
