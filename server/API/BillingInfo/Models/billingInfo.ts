import { Document, Schema, Model, model} from 'mongoose';

interface IBillingInfo {
  street_address: string;
  city: string;
  zip: string;
  apartment?: string;
}

export interface IBillingInfoModel extends IBillingInfo, Document {}

export const billingInfoSchema = new Schema({
  street_address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  apartment: {
    type: String
  }
});

export const BillingInfo: Model<IBillingInfoModel> = model<IBillingInfoModel>('BillingInfo', billingInfoSchema);
