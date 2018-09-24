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
      return await createProduct({
        product_title,
        description,
        price,
        sale_price,
        sale_price_start,
        sale_price_expiry,
        shipping_time,
        images
      });
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
      return await editProduct({
        product_id,
        product_title,
        description,
        price,
        sale_price,
        sale_price_start,
        sale_price_expiry,
        shipping_time,
        images
      });
    },
    deleteProduct: async (_, { input: { product_id } }, { req }) => {
      isAdmin(req.user);
      return await deleteProduct({
        product_id
      });
    }
  }
};
