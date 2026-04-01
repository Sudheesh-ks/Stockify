import { SaleDTO } from "../dtos/sale.dto";
import { SaleDocument } from "../models/salesModel";

export const toSaleDTO = (sale: SaleDocument): SaleDTO => {
  return {
    _id: sale._id.toString(),
    productId: sale.productId.toString(),
    productName: (sale.productId as any).name || "Unknown Product",
    quantity: sale.quantity,
    price: sale.price,
    totalAmount: sale.totalAmount,
    customerName: sale.customerName,
    date: sale.date,
  };
};
