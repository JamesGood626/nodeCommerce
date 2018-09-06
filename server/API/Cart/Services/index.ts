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

interface IRemoveProduct {
  product_id: string;
  price: number;
}

// Pretty much the same thing as createBillingInfo, could do some injection with the "billing_info" or "cart"
// to use for set, may try refactoring for that later.
export const createCart = (input: ICreateCart, user) => {
  return new Promise(async (resolve, reject) => {
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
        // THIS IS HOW YOU NEEDED TO UPDATE TO AVOID LOSING SUBSEQUENT
        // ADDITIONS TO THE QUANTITY OBJECT. DON'T MUTATE.
        (user as any).cart.quantity = {
          ...(user as any).cart.quantity,
          [product_id]: quantity
        };
        (user as any).cart.products.push(product_id);
        return await (user as any).save().catch(err => {
          console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
        });
      }
    );
    return resolve(retrievedUser as any);
  });
};

// See caps above for below.
// Running into problems testing this..
// Doesn't make sense, because the edit product test just above it returns quantity
// just fine after the edit is complete and the graphql mutation resolves.
// However, When running removeProduct... I'm deleting the first product in the array
// and haven't even deleted anything from the quantity object yet, but somehow
// the first products quantity is the only one that's available inside of the user's
// cart.quantity object.... TF?!
export const removeProduct = async (input: IRemoveProduct, user) => {
  return new Promise(async (resolve, reject) => {
    const { product_id, price } = input;
    const retrievedUser = await User.findOne({ email: user.email }).then(
      async user => {
        const keys = Object.keys((user as any).cart.quantity);
        let quantityForTotalPriceCalculation;
        (user as any).cart.products.pull(product_id);
        (user as any).cart.quantity = keys.reduce((acc, curr) => {
          if (curr === product_id) {
            quantityForTotalPriceCalculation = (user as any).cart.quantity[
              curr
            ];
            return acc;
          }
          acc[curr] = (user as any).cart.quantity[curr];
          return acc;
        }, {});
        (user as any).cart.total_price_amount -=
          quantityForTotalPriceCalculation * price;
        return await (user as any).save().catch(err => {
          console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
        });
      }
    );
    return resolve(retrievedUser as any);
  });
};

export const retrieveProductsList = async productIdArr => {
  if (productIdArr.length > 1) {
    return await Product.find({ _id: { $in: productIdArr } }, (err, result) => {
      console.log("THE ERR FINDING PRODUCT LIST: ", err);
      console.log("THE RESULT OF FINDING THE PRODUCT LIST: ", result);
      return result;
    });
  } else {
    const product = await Product.findById(productIdArr[0]).then(
      result => result
    );
    return [product];
  }
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
