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

export const adminGetAllUserOrders = async userId => {
  console.log("THE USERID IN ADMIN GET ALL USER ORDERS: ", userId);
  const allOrders: IOrderModel[] = await Order.find({}).then(result => result);
  return allOrders;
};

export const createOrderWithUsersBillingInfo = async user => {
  console.log("THE USER IN CREATE ORDER: ", user);
  return new Promise(async (resolve, reject) => {
    const totalAmount = user.cart.total_price_amount;
    const totalAfterTax = totalAmount + totalAmount * 0.14;
    const orderInput = {
      user: user._id,
      total_amount: totalAmount,
      after_tax_amount: totalAfterTax.toFixed(2),
      shipping_cost: 7.99,
      shipping_address: user.billing_info,
      products: user.cart.products,
      quantity: user.cart.quantity
    };
    const order = new Order(orderInput);
    await order.save();
    console.log("THE SAVED ORDER: ", order);
    return resolve(order);
  });
};

export const createOrderWithShippingAddressInput = async (input, user) => {
  return new Promise(async (resolve, reject) => {
    const order = new Order(input);
    await order.save();
    return resolve(order);
  });
};
// For edit order input I'd want to allow for the product list
// and quantity to be changed, only if both of those were
// passed as input. One can't be updated w/out the other.
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

export const deleteOrder = ({ order_id }, user) => {
  return new Promise(async (resolve, reject) => {
    const orderDeleted = await Order.findById(order_id).then(result => {
      if (result) {
        return result.remove();
      }
    });
    return resolve(orderDeleted as any);
  });
};
