// import { User } from "../../Accounts/Models/user";
import { Product, IProduct, IProductModel } from "../Models/product";

export const getAllProducts = async () => {
  const allProducts: IProductModel[] = await Product.find({}).then(
    result => result
  );
  return allProducts;
};

export const createProduct = (input, user) => {
  return new Promise(async (resolve, reject) => {
    console.log(
      "Inside of createProduct helper function. Heres input: ",
      input
    );
    const product = new Product(input);
    await product.save();
    console.log("THE SAVED PRODUCT: ", product);
    return resolve(product);
  });
};

// export const editBillingInfo = async (input: IProduct, user) => {
//   return new Promise(async (resolve, reject) => {
//     const retrievedUser = await User.findOne({ email: user.email }).then(
//       result => result
//     );
//     (retrievedUser as any).set("billing_info", input);
//     await (retrievedUser as any).save().catch(err => {
//       console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
//     });
//     return resolve((retrievedUser as any).billing_info);
//   });
// };

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
