import { isUserAuthenticated } from "../../middlewareResolvers";
import {
  createCart,
  editCart,
  removeProduct,
  retrieveProductsList
  // deleteBillingInfo
} from "../Services";

export const cartResolvers = {
  // Why does removing this query in the resolver and in the type definitions cause the mutations
  // to fail?..
  Query: {
    allCarts: (_, __, { req }): any => {
      return { street_address: "12", city: "umm", country: "huh" };
    }
  },
  Mutation: {
    // removed discount option for now.
    createCart: async (
      _,
      { input: { product_id, price, quantity, sale_price } },
      { req }
    ) => {
      isUserAuthenticated(req.user);
      return await createCart(
        { product_id, price, quantity, sale_price },
        req.user
      );
    },
    editCart: async (
      _,
      { input: { product_id, price, quantity, sale_price } },
      { req }
    ) => {
      isUserAuthenticated(req.user);
      return await editCart(
        { product_id, price, quantity, sale_price },
        req.user
      );
    },
    removeProduct: async (_, { input: { product_id, price } }, { req }) => {
      isUserAuthenticated(req.user);
      return await removeProduct({ product_id, price }, req.user);
    }
  },
  Cart: {
    products: async (parentValue, __, { req }) => {
      // parentValue will the be returned value from any of the queries/mutations that will
      // be accessible in here whenever the products field is a requested return value
      // on the query/mutation.
      return await retrieveProductsList(parentValue.products);
    }
  }
};

// Example obj that's available in the products resolver.
// { products: [ 5b8d81358d9dc6bd50f91fc5, 5b8d81358d9dc6bd50f91fc6 ],
//   _id: 5b8d81368d9dc6bd50f91fc9,
//   total_price_amount: 79.94,
//   quantity:
//    { '5b8d81358d9dc6bd50f91fc5': 2, '5b8d81358d9dc6bd50f91fc6': 4 }
// }

//     editBillingInfo: (
//       _,
//       { input: { street_address, apartment, city, state, zip, country } },
//       { req }
//     ) => {
//       return editBillingInfo(
//         { street_address, apartment, city, state, zip, country },
//         req.user
//       );
//     },
//     deleteBillingInfo: (_, { input: bool }, { req }) => {
//       return deleteBillingInfo(req.user);
//     }

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
