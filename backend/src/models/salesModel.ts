import mongoose, { Schema, Document, Types } from "mongoose";

export interface SaleDocument extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  totalAmount: number;
  customerName: string;
  date: Date;
}

const saleSchema: Schema<SaleDocument> = new Schema<SaleDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    customerName: {
      type: String,
      default: "Cash",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const salesModel = mongoose.model<SaleDocument>("sales", saleSchema);

export default salesModel;
