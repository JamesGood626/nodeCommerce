import { Document, Schema, Model, model} from 'mongoose';

interface ISuperUser {
  username: string;
  password: string;
}

export interface ISuperUserModel extends ISuperUser, Document {}

const superUserSchema: Schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export const SuperUser: Model<ISuperUserModel> = model<ISuperUserModel>('SuperUser', superUserSchema);
