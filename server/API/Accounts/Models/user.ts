import { Document, Schema, Model, model } from "mongoose";
import { IBillingInfo } from "../../BillingInfo/Models/billingInfo";
import { ICart } from "../../Cart/Models/cart";
import { IUserReviewModel } from "../../UserReviews/Models/userReview";
import { billingInfoSchema } from "../../BillingInfo/Models/billingInfo";
import { cartSchema } from "../../Cart/Models/cart";
// import { UserReview } from "../../UserReviews/Models/userReview";

interface IUser {
  email: string;
  password: string;
  billing_info: IBillingInfo;
  cart: ICart;
  user_reviews: [IUserReviewModel];
}

export interface IUserModel extends IUser, Document {}

export const userSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  billing_info: {
    type: billingInfoSchema
  },
  cart: {
    type: cartSchema
  },
  user_reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserReview"
    }
  ],
  is_admin: {
    type: Boolean
  }
});

export const User: Model<IUserModel> = model<IUserModel>("User", userSchema);
