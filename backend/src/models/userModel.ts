import mongoose, { Model, Schema, Types } from "mongoose";
import { UserTypes } from "../types/user";

export interface userDocument extends Omit<UserTypes, "_id">, Document {
  _id: Types.ObjectId;
}

const userSchema: Schema<userDocument> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  shopname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel: Model<userDocument> = mongoose.model<userDocument>("User", userSchema);

export default userModel;
