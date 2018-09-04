import { Mongoose } from "mongoose";
import { User } from "../../Accounts/Models/user";
import { Product } from "../../Products/Models/product";
import { ICart } from "../Models/cart";

// export const getAllBillingInfo = async () => {
//   const allBillingInfo: IBillingInfoModel[] = await BillingInfo.find({}).then(
//     result => result
//   );
//   return allBillingInfo;
// };

interface ICreateCart {
  product_id: string;
  price: number;
  quantity: number;
  sale_price?: number;
}

// Pretty much the same thing as createBillingInfo, could do some injection with the "billing_info" or "cart"
// to use for set, may try refactoring for that later.
export const createCart = (input: ICreateCart, user) => {
  return new Promise(async (resolve, reject) => {
    console.log("creating cart: ", input);
    const retrievedUser = await User.findOne({ email: user.email }).then(
      result => result
    );
    const { product_id, quantity, price } = input;
    const setQuantity = { [product_id]: quantity };
    const totalPriceAmount = price * quantity;
    (retrievedUser as any).set("cart", {
      total_price_amount: totalPriceAmount,
      products: [product_id],
      quantity: setQuantity
    });
    await (retrievedUser as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH NEW CART: ", err); // TODO: Handle Error
    });
    return resolve(retrievedUser as any);
  });
};

export const editCart = async (input: ICreateCart, user) => {
  return new Promise(async (resolve, reject) => {
    const { product_id, quantity, price } = input;
    const retrievedUser = await User.findOne({ email: user.email }).then(
      async user => {
        const additionalPrice = price * quantity;
        (user as any).cart.total_price_amount += additionalPrice;
        (user as any).cart.quantity[product_id] = quantity;
        (user as any).cart.products.push(product_id);
        return await (user as any).save().catch(err => {
          console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
        });
      }
    );
    return resolve(retrievedUser as any);
  });
};

export const retrieveProductsList = async productIdArr => {
  return await Product.find({ _id: { $in: productIdArr } }, (err, result) => {
    console.log("THE ERR FINDING PRODUCT LIST: ", err);
    return result;
  });
};

// export const deleteBillingInfo = user => {
//   return new Promise(async (resolve, reject) => {
//     console.log("DELETE BILLING INFO IS BEING CALLED.");
//     const retrievedUser = await User.findOne({ email: user.email }).then(
//       result => result
//     );
//     (retrievedUser as any).billing_info.remove();
//     await (retrievedUser as any).save().catch(err => {
//       console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
//     });
//     return resolve(retrievedUser as any);
//   });
// };
