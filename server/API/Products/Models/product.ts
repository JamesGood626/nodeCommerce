import { Document, Schema, Model, model } from "mongoose";
// import { UserReview } from "../../UserReviews/Models/userReview";

export interface IProduct {
  product_title: string;
  description: string;
  price: number;
  sale_price?: number;
  sale_price_start?: Date;
  sale_price_expiry?: Date;
  shipping_time?: string;
  images: [string];
}

export interface IProductModel extends IProduct, Document {}

export const productSchema = new Schema({
  product_title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sale_price: {
    type: Number
  },
  sale_price_start: {
    type: Date
  },
  shipping_time: {
    type: String
  },
  images: {
    type: [String],
    unique: true,
    required: true
  }
  // user_reviews: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "UserReview"
  //   }
  // ]
});

export const Product: Model<IProductModel> = model<IProductModel>(
  "Product",
  productSchema
);

// sale_price_expiry: {
//   type: Date
// },
