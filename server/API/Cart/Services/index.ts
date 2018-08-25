// import { BillingInfo, IBillingInfoModel } from "../Models/billingInfo";
import { User } from "../../Accounts/Models/user";
import { ICart } from "../Models/cart";

// export const getAllBillingInfo = async () => {
//   const allBillingInfo: IBillingInfoModel[] = await BillingInfo.find({}).then(
//     result => result
//   );
//   return allBillingInfo;
// };

// Pretty much the same thing as createBillingInfo, could do some injection with the "billing_info" or "cart"
// to use for set, may try refactoring for that later.
export const createCart = (input: ICart, user) => {
  return new Promise(async (resolve, reject) => {
    console.log("creating cart: ", input);
    const retrievedUser = await User.findOne({ email: user.email }).then(
      result => result
    );
    (retrievedUser as any).set("cart", input);
    await (retrievedUser as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH NEW CART: ", err); // TODO: Handle Error
    });
    console.log("USER AFTER SAVING CREATED CART: ", retrievedUser);
    return resolve((retrievedUser as any).billing_info);
  });
};

// export const editBillingInfo = async (input: ICart, user) => {
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
