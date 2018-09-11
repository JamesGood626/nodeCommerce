import { User, IUserModel } from "../Models/user";
import { Order } from "../../Orders/Models/order";

export const getAllUsers = async () => {
  const allUsers: IUserModel[] = await User.find({}).then(result => result);
  return allUsers;
};

export const retrieveOrderList = async orderIdArr => {
  if (orderIdArr.length > 1) {
    return await Order.find({ _id: { $in: orderIdArr } }, (err, result) => {
      console.log("THE ERR FINDING order LIST: ", err);
      console.log("THE RESULT OF FINDING THE order LIST: ", result);
      return result;
    });
  } else {
    const order = await Order.findById(orderIdArr[0]).then(result => result);
    return [order];
  }
};
