import { SaleDTO } from "../dtos/sale.dto";
import { SaleDocument } from "../models/salesModel";

export const toSaleDTO = (sale: SaleDocument): SaleDTO => {
  return {
    _id: sale._id.toString(),
    items: (sale.items || []).map((item) => ({
      productId: item.productId.toString(),
      productName: (item.productId as any).name || "Unknown Product",
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: sale.totalAmount,
    customerName: sale.customerName,
    date: sale.date,
  };
};
