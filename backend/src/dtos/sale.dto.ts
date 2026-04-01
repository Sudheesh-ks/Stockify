export interface SaleDTO {
  _id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  totalAmount: number;
  customerName: string;
  date: Date;
}
