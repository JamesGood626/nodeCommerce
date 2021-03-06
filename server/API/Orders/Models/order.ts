import { Document, Schema, Model, model } from "mongoose";
import { IProduct } from "../../Products/Models/product";

export interface IShippingAddress {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  apartment?: string;
  country: string;
}

const shippingAddressSchema = new Schema({
  street_address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip_code: {
    type: String,
    required: true
  },
  apartment: {
    type: String
  },
  country: {
    type: String,
    required: true
  }
});

export interface IOrder {
  total_amount: string;
  after_tax_amount: string;
  shipping_cost: string;
  shipping_address: IShippingAddress;
  products: [IProduct];
}

export interface IOrderModel extends IOrder, Document {}

// Prices for total_amount and after_tax_amount will require some pre_save hooks to calculate
export const orderSchema = new Schema({
  user_email: {
    type: String,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  after_tax_amount: {
    type: Number,
    required: true
  },
  shipping_cost: {
    type: Number,
    required: true
  },
  shipping_address: {
    type: shippingAddressSchema
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  quantity: {
    type: Schema.Types.Mixed
  }
});

export const Order: Model<IOrderModel> = model<IOrderModel>(
  "Order",
  orderSchema
);
