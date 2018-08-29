import { Order, IOrderModel } from "../Models/order";

export const getAllOrders = async () => {
  const allOrders: IOrderModel[] = await Order.find({}).then(result => result);
  return allOrders;
};

export const allUserOrders = async user => {
  console.log("THE USER IN ALL USER ORDERS: ", user);
  const allOrders: IOrderModel[] = await Order.find({}).then(result => result);
  return allOrders;
};

export const createOrder = (input, user) => {
  return new Promise(async (resolve, reject) => {
    const order = new Order(input);
    await order.save();
    return resolve(order);
  });
};

export const editOrder = async (input, user) => {
  if (!user.is_admin) {
    return;
  }
  return new Promise(async (resolve, reject) => {
    const { order_id } = input;
    const order = await Order.findByIdAndUpdate(
      order_id,
      { $set: input },
      { new: true },
      (err, order) => {
        if (err) {
          return console.log(err);
        }
        return order;
      }
    );
    return resolve(order as any);
  });
};

// export const deleteOrder = ({ order_id }, user) => {
//   if (!user.is_admin) {
//     return false;
//   }
//   return new Promise(async (resolve, reject) => {
//     const orderDeleted = await Order.findById(order_id).then(result => {
//       if (result) {
//         return result.remove();
//       }
//     });
//     return resolve(orderDeleted as any);
//   });
// };
