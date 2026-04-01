import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ProductsTypes } from "../types/product";

export interface ProductsDocument extends Omit<ProductsTypes, "_id">, Document {
  _id: Types.ObjectId;
}

const productsSchema: Schema<ProductsDocument> = new Schema<ProductsDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: false,
  }
);

const productsModel: Model<ProductsDocument> = mongoose.model<ProductsDocument>(
  "products",
  productsSchema
);

export default productsModel;