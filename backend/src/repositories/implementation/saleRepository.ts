import mongoose from "mongoose";
import salesModel, { SaleDocument } from "../../models/salesModel";
import { BaseRepository } from "../baseRepository";
import { ISaleRepository } from "../interface/ISaleRepository";

export class SaleRepository
  extends BaseRepository<SaleDocument>
  implements ISaleRepository
{
  constructor() {
    super(salesModel);
  }

  async createSale(
    userId: string,
    sale: Partial<SaleDocument>,
  ): Promise<SaleDocument> {
    return this.create({ ...sale, userId: userId as any });
  }

  async getAllSales(
    userId: string,
    filter: any = {},
    page: number = 1,
    limit: number = 5,
  ): Promise<{ sales: SaleDocument[]; totalCount: number }> {
    const query = { ...filter, userId };
    const totalCount = await this.countDocuments(query);

    const sales = await this.model
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("items.productId")
      .exec();

    return { sales, totalCount };
  }

  async getSalesByCustomer(
    userId: string,
    customerName: string,
  ): Promise<SaleDocument[]> {
    return this.model
      .find({
        userId,
        customerName: { $regex: customerName, $options: "i" },
      })
      .sort({ date: -1 })
      .populate("items.productId")
      .exec();
  }

  async getItemsReport(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const results = await mongoose.model("products").aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "sales",
          let: { productId: "$_id" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.productId", "$$productId"] } } },
          ],
          as: "saleItems",
        },
      },
      {
        $addFields: {
          sold: { $sum: "$saleItems.items.quantity" },
        },
      },
      {
        $project: {
          name: 1,
          stock: "$quantity",
          sold: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalCount = results[0]?.metadata[0]?.total || 0;
    const data = results[0]?.data || [];
    return { data, totalCount };
  }

  async getCustomerLedger(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const results = await this.model.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            $cond: [
              {
                $or: [
                  { $eq: ["$customerName", ""] },
                  { $not: ["$customerName"] },
                ],
              },
              "User not found",
              "$customerName",
            ],
          },
          name: {
            $first: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$customerName", ""] },
                    { $not: ["$customerName"] },
                  ],
                },
                "User not found",
                "$customerName",
              ],
            },
          },
          transactions: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalCount = results[0]?.metadata[0]?.total || 0;
    const data = results[0]?.data || [];
    return { data, totalCount };
  }

  async deleteSale(id: string): Promise<void> {
    await this.deleteById(id);
  }
}
