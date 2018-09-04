import { Schema } from "mongoose";

export interface IBillingInfo {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  apartment?: string;
  country: string;
}

export const billingInfoSchema = new Schema({
  street_address: {
    type: String
  },
  apartment: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip_code: {
    type: String
  },
  country: {
    type: String
  }
});
