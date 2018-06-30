import { Document, Schema, Model, model} from 'mongoose';

interface IUser {
  email: string;
  password: string;
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
  }
});

export const User: Model<IUserModel> = model<IUserModel>('User', userSchema);
