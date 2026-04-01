import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
    name: string;
    address: string;
    mobile: string;
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new Schema<CustomerDocument>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        mobile: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<CustomerDocument>("customers", customerSchema);
