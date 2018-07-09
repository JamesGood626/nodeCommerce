import { Document, Schema, Model, model } from 'mongoose';
import { User } from '../../Accounts/Models/user';

interface IUserReview {
  user_id: object;
  rating: number;
  comment: string;
  date_time: Date;
}

export interface IUserReviewModel extends IUserReview, Document {}

export const userReviewSchema: Schema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date_time: {
    type: Date,
    default: Date.now
  },
  edited_date: {
    type: Date
  }
});

export const UserReview: Model<IUserReviewModel> = model<IUserReviewModel>('UserReview', userReviewSchema);
