import { Document, Schema, Model, model } from "mongoose";
import * as UserReview from "../../UserReviews/Models/userReview";

interface IProduct {
  price: number;
  sale_price: number;
  sale_price_start: Date;
  sale_price_expiry: Date;
  shipping_time: string;
  description: string;
}

export interface IProductModel extends IProduct, Document {}

export const productSchema = new Schema({
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
  sale_price_expiry: {
    type: Date
  },
  shipping_time: {
    type: String
    // I'll hold off on making it required for now.
    // required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: [Buffer],
    unique: true,
    required: true
  }
  // reviews: {
  //   type: [ UserReview ],
  //   unique: true
  // }
});

export const Product: Model<IProductModel> = model<IProductModel>(
  "Product",
  productSchema
);
