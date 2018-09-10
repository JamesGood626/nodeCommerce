import { isUserAuthenticated, isAdmin } from "../../middlewareResolvers";
import {
  getAllOrders,
  allUserOrders,
  adminGetAllUserOrders,
  createOrderWithUsersBillingInfo,
  createOrderWithShippingAddress,
  editOrder,
  deleteOrder
} from "../Services";
import { retrieveProductsList } from "../../Cart/Services";

export const orderResolvers = {
  Query: {
    allOrders: (_, __, { req }): any => {
      isAdmin(req.user);
      return getAllOrders();
    },
    allUserOrders: (_, __, { req }): any => {
      isUserAuthenticated(req.user);
      return allUserOrders(req.user);
    },
    adminGetAllUserOrders: (_, { input: { user_id } }, { req }): any => {
      isAdmin(req.user);
      return adminGetAllUserOrders(user_id);
    }
  },
  Mutation: {
    createOrderWithUsersBillingInfo: async (_, __, { req }) => {
      isUserAuthenticated(req.user);
      return await createOrderWithUsersBillingInfo(req.user);
    },
    createOrderWithShippingAddress: async (_, { input }, { req }) => {
      isUserAuthenticated(req.user);
      return await createOrderWithShippingAddress(input, req.user);
    },
    editOrder: async (
      _,
      { input: { order_id, shipping_address, products, quantity } },
      { req }
    ) => {
      isAdmin(req.user);
      return await editOrder(
        {
          order_id,
          shipping_address,
          products,
          quantity
        },
        req.user
      );
    },
    deleteOrder: async (_, { input: { order_id } }, { req }) => {
      isAdmin(req.user);
      return await deleteOrder(
        {
          order_id
        },
        req.user
      );
    }
  },
  Order: {
    products: async (parentValue, __, { req }) => {
      // parentValue will the be returned value from any of the queries/mutations that will
      // be accessible in here whenever the products field is a requested return value
      // on the query/mutation.
      return await retrieveProductsList(parentValue.products);
    }
  }
};
