import { User, IUserModel } from "../Models/user";

export const getAllUsers = async () => {
  const allUsers: IUserModel[] = await User.find({}).then(result => result);
  return allUsers;
};
