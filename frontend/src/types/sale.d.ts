export interface SaleItem {
    productId: string;
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
