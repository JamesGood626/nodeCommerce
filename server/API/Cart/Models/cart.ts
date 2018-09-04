import { Document, Schema, Model, model } from "mongoose";
import { Product, IProductModel } from "../../Products/Models/product";

export interface ICart {
  total_price_amount: string;
  products: IProductModel[];
  product_quantity: object;
  discount: number;
  total_price_with_discount: number;
}

// IQuantity[]

// interface IQuantity {
//   product_id: string;
//   quantity: number;
// }

// const quantitySchema = new Schema({
//   product_id: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   }
// });

export const cartSchema = new Schema({
  total_price_amount: {
    type: Number,
    required: true
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

// discount: {
//   type: Number
// },
// total_price_with_discount: {
//   type: Number
// }

// The Mixed type, I think this is more suitable,
// As I'd rather have object key lookup rather than iterate
// through an array to find the corresponding product quantity.
// https://mongoosejs.com/docs/schematypes.html
// let YourSchema = new Schema({
//   inventoryDetails: Schema.Types.Mixed
// })

// let yourSchema = new YourSchema;

// yourSchema.inventoryDetails = { any: { thing: 'you want' } }

// yourSchema.save()
