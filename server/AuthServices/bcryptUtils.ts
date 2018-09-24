import * as bcrypt from "bcrypt";
import { IUserModel } from "../API/Accounts/Models/user";
const saltRounds = 10;

export const hashPassword = (
  user: any,
  password: string
): Promise<IUserModel> => {
  return new Promise(
    (resolve: any, reject: any): void => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (error, hash) => {
          user.password = hash;
          await user.save();
          return resolve(user);
        });
      });
    }
  );
};
