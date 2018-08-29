import {
  getAllOrders,
  allUserOrders,
  createOrder,
  editOrder
} from "../Services";

export const orderResolvers = {
  Query: {
    allOrders: (_, __, { req }): any => {
      return getAllOrders();
    },
    allUserOrders: (_, __, { req }): any => {
      return allUserOrders(req.user);
    }
  },
  Mutation: {
    createOrder: async (
      _,
      { input: { shipping_cost, shipping_address, products } },
      { req }
    ) => {
      return await createOrder(
        {
          shipping_cost,
          shipping_address,
          products
        },
        req.user
      );
    },
    editOrder: async (
      _,
      { input: { shipping_cost, shipping_address, products } },
      { req }
    ) => {
      return await editOrder(
        {
          shipping_cost,
          shipping_address,
          products
        },
        req.user
      );
    }
  }
};

// deleteOrder: async (_, { input: { order_id } }, { req }) => {
//   return await deleteOrder(
//     {
//       order_id
//     },
//     req.user
//   );
// }
