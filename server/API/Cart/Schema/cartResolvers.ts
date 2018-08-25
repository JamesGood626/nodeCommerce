import {
  createCart
  // editBillingInfo,
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
    createCart: async (
      _,
      {
        input: {
          total_price_amount,
          products,
          discount,
          total_price_with_discount
        }
      },
      { req }
    ) => {
      console.log("in create cart resolver: ", products);
      return await createCart(
        { total_price_amount, products, discount, total_price_with_discount },
        req.user
      );
    }
  }
};

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
