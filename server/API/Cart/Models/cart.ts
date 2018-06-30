import { Document, Schema, Model, model} from 'mongoose';
import { Product, IProductModel } from '../../Products/Models/product';

interface ICart {
  total_price_amount: string;
  products: IProductModel[];
  discount: number;
  total_price_with_discount: number;
}

export interface ICartModel extends ICart, Document {}

export const cartSchema = new Schema({
  total_price_amount: {
    type: Number,
    required: true
  },
  // products: {
  //   type: [ Product ]
  // },
  discount: {
    type: Number
  },
  total_price_with_discount: {
    type: Number
  }
});

export const Cart: Model<ICartModel> = model<ICartModel>('Cart', cartSchema);
