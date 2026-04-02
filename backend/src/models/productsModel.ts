import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ProductsTypes } from "../types/product";

export interface ProductsDocument extends Omit<ProductsTypes, "_id" | "userId">, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}

const productsSchema: Schema<ProductsDocument> = new Schema<ProductsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const productsModel: Model<ProductsDocument> = mongoose.model<ProductsDocument>(
  "products",
  productsSchema
);

export default productsModel;