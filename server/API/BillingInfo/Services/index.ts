// import { BillingInfo, IBillingInfoModel } from "../Models/billingInfo";
import { User } from "../../Accounts/Models/user";
import { IBillingInfo } from "../Models/billingInfo";

// export const getAllBillingInfo = async () => {
//   const allBillingInfo: IBillingInfoModel[] = await BillingInfo.find({}).then(
//     result => result
//   );
//   return allBillingInfo;
// };

export const createBillingInfo = (input: IBillingInfo, user) => {
  return new Promise(async (resolve, reject) => {
    const retrievedUser = await User.findOne({ email: user.email }).then(
      result => result
    );
    (retrievedUser as any).set("billing_info", input);
    await (retrievedUser as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
    });
    return resolve((retrievedUser as any).billing_info);
  });
};

// Last left off not knowing why this won't execute when query is called in the test
export const editBillingInfo = async (input: IBillingInfo, user) => {
  return new Promise(async (resolve, reject) => {
    const retrievedUser = await User.findOne({ email: user.email }).then(
      result => result
    );
    (retrievedUser as any).set("billing_info", input);
    await (retrievedUser as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
    });
    return resolve((retrievedUser as any).billing_info);
  });
};

export const deleteBillingInfo = user => {
  return new Promise(async (resolve, reject) => {
    const retrievedUser = await User.findById(user._id).then(result => result);
    (retrievedUser as any).billing_info.remove();
    await (retrievedUser as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
    });
    return resolve(retrievedUser as any);
  });
};
