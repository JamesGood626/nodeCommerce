import { Order, IOrderModel } from "../Models/order";
import { User, IUserModel } from "../../Accounts/Models/user";

const removeCartAndSaveOrderOnUser = async (user, orderId) => {
  await User.findOne({ email: user.email }).then(async user => {
    (user as any).cart.remove();
    (user as any).orders.push(orderId);
    return await (user as any).save().catch(err => {
      console.log("ERROR SAVING UPDATED USER WITH CART REMOVED INFO: ", err); // TODO: Handle Error
    });
  });
};

const retrieveOrderList = async orderIdArr => {
  if (orderIdArr.length > 1) {
    return await Order.find({ _id: { $in: orderIdArr } }, (err, result) => {
      console.log("THE ERR FINDING PRODUCT LIST: ", err);
      console.log("THE RESULT OF FINDING THE ORDER LIST: ", result);
      return result;
    });
  } else {
    const order = await Order.findById(orderIdArr[0]).then(result => result);
    return [order];
  }
};

export const getAllOrders = async () => {
  const allOrders: IOrderModel[] = await Order.find({}).then(result => result);
  return allOrders;
};

export const allUserOrders = async user => {
  const orders = await retrieveOrderList(user.orders);
  return orders;
};

export const adminGetAllUserOrders = async ({ user_email }) => {
  const orders = await Order.find({ user_email }).then(result => result);
  return orders;
};

export const createOrderWithUsersBillingInfo = async user => {
  return new Promise(async (resolve, reject) => {
    const totalAmount = user.cart.total_price_amount;
    const totalAfterTax = totalAmount + totalAmount * 0.14;
    const orderInput = {
      user_email: user.email,
      total_amount: totalAmount,
      after_tax_amount: totalAfterTax.toFixed(2),
      shipping_cost: 7.99,
      shipping_address: user.billing_info,
      products: user.cart.products,
      quantity: user.cart.quantity
    };
    const order = new Order(orderInput);
    await order.save();
    await removeCartAndSaveOrderOnUser(user, order._id);
    return resolve(order);
  });
};

export const createOrderWithShippingAddress = async (input, user) => {
  return new Promise(async (resolve, reject) => {
    const totalAmount = user.cart.total_price_amount;
    const totalAfterTax = totalAmount + totalAmount * 0.14;
    const orderInput = {
      user_email: user.email,
      total_amount: totalAmount,
      after_tax_amount: totalAfterTax.toFixed(2),
      shipping_cost: 7.99,
      shipping_address: input,
      products: user.cart.products,
      quantity: user.cart.quantity
    };
    const order = new Order(orderInput);
    await order.save();
    await removeCartAndSaveOrderOnUser(user, order._id);
    return resolve(order);
  });
};

// For edit order input I'd want to allow for the product list
// and quantity to be changed, only if both of those were
// passed as input. One can't be updated w/out the other.
export const editOrder = async (input, user) => {
  console.log("THE EDIT ORDER INPUT: ", input);
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
    console.log("ORDER BEING RETURNED FROM EDIT: ", order);
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
