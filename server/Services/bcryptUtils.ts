import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IUserModel } from '../API/Accounts/Models/user';
import { ISuperUserModel } from '../API/SuperUser/Models/superUser';
const saltRounds = 10;

// user type needs to be an interface too O; Maybe?
export const hashPassword =
(user: any, password: string): Promise<Model<ISuperUserModel>> | Promise<Model<ISuperUserModel>> => {
  return new Promise((resolve: any, reject: any): void => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        user.password = hash;
        user.save();
        resolve(user);
      });
    });
  });
};
