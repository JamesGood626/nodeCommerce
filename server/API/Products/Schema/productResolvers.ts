import { isUserAuthenticated, isAdmin } from "../../middlewareResolvers";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct
} from "../Services";

export const productResolvers = {
  Query: {
    allProducts: (_, __, { req }): any => {
      return getAllProducts();
    }
  },
  Mutation: {
    createProduct: async (
      _,
      {
        input: {
          product_title,
          description,
          price,
          sale_price,
          sale_price_start,
          sale_price_expiry,
          shipping_time,
          images
        }
      },
      { req }
    ) => {
      isAdmin(req.user);
      return await createProduct(
        {
          product_title,
          description,
          price,
          sale_price,
          sale_price_start,
          sale_price_expiry,
          shipping_time,
          images
        },
        req.user
      );
    },
    editProduct: async (
      _,
      {
        input: {
          product_id,
          product_title,
          description,
          price,
          sale_price,
          sale_price_start,
          sale_price_expiry,
          shipping_time,
          images
        }
      },
      { req }
    ) => {
      isAdmin(req.user);
      return await editProduct(
        {
          product_id,
          product_title,
          description,
          price,
          sale_price,
          sale_price_start,
          sale_price_expiry,
          shipping_time,
          images
        },
        req.user
      );
    },
    deleteProduct: async (_, { input: { product_id } }, { req }) => {
      isAdmin(req.user);
      return await deleteProduct(
        {
          product_id
        },
        req.user
      );
    }
  }
};

// description,
// price,
// sale_price,
// sale_price_start,
// sale_price_expiry,
// shipping_time,
// images

// description,
// price,
// sale_price,
// sale_price_start,
// sale_price_expiry,
// shipping_time,
// images

// editBillingInfo: (
//   _,
//   { input: { street_address, apartment, city, state, zip, country } },
//   { req }
// ) => {
//   return editBillingInfo(
//     { street_address, apartment, city, state, zip, country },
//     req.user
//   );
// },
// deleteBillingInfo: (_, { input: bool }, { req }) => {
//   return deleteBillingInfo(req.user);
// }

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
