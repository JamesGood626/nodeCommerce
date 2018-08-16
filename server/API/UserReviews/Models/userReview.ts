import { Document, Schema, Model, model } from "mongoose";
import { IUserModel } from "../../Accounts/Models/user";
import { IProductModel } from "../../Products/Models/product";

interface IUserReview {
  reviewer: IUserModel;
  rating: number;
  comment: string;
  review_date: Date;
  product_reviewed: IProductModel;
}

// User has a list of UserReviews referenced
// Product has a list of UserReviews referenced
export interface IUserReviewModel extends IUserReview, Document {}
// How to build in a range of 1-5 into the rating Number? I guess a validator.
export const userReviewSchema: Schema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  review_date: {
    type: Date,
    default: Date.now
  },
  last_edited: {
    type: Date
  },
  product_reviewed: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  }
});

export const UserReview: Model<IUserReviewModel> = model<IUserReviewModel>(
  "UserReview",
  userReviewSchema
);
