import { ProductDTO } from "../dtos/product.dto";
import { ProductsDocument } from "../models/productsModel";

export const toProductDTO = (product: ProductsDocument): ProductDTO => {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
  };
};
