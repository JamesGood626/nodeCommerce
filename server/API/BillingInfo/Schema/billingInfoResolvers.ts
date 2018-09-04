import { isUserAuthenticated } from "../../middlewareResolvers";
import {
  createBillingInfo,
  editBillingInfo,
  deleteBillingInfo
} from "../Services";

export const billingInfoResolvers = {
  // Why does removing this query in the resolver and in the type definitions cause the mutations
  // to fail?..
  Query: {
    allBillingInfo: (_, __, { req }): any => {
      return { street_address: "12", city: "umm", country: "huh" };
    }
  },
  Mutation: {
    createBillingInfo: async (
      _,
      { input: { street_address, apartment, city, state, zip_code, country } },
      { req }
    ) => {
      isUserAuthenticated(req.user);
      return await createBillingInfo(
        { street_address, apartment, city, state, zip_code, country },
        req.user
      );
    },
    editBillingInfo: async (
      _,
      { input: { street_address, apartment, city, state, zip_code, country } },
      { req }
    ) => {
      isUserAuthenticated(req.user);
      return await editBillingInfo(
        { street_address, apartment, city, state, zip_code, country },
        req.user
      );
    },
    deleteBillingInfo: async (_, __, { req }) => {
      isUserAuthenticated(req.user);
      return await deleteBillingInfo(req.user);
    }
  }
};

// : Promise<IBillingInfoModel | Error>

// createBillingInfo: (
//   parentValue,
//   { street_address, apartment, city, state, zip, country },
//   { req }
// ): any => {
//   return createBillingInfo({
//     street_address,
//     apartment,
//     city,
//     state,
//     zip,
//     country
//   });
// },
// Mutation: {
// editBillingInfo: (parentValue, { street_address }, { req }) => {
//   return editBillingInfo(req.user);
// },
//   deleteBillingInfo: (parentValue, { street_address }, { req }): any => {
//     return deleteBillingInfo(req.user);
//   }
// }
