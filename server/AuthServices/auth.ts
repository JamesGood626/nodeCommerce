import * as bcrypt from "bcrypt";
import * as passport from "passport";
import { hashPassword } from "./bcryptUtils";
import { Model } from "mongoose";
import { User, IUserModel } from "../API/Accounts/Models/user";

interface ICreateUserInput {
  email: string;
  password: string;
  is_admin?: boolean;
}

export const createUser = (
  createUserInput: ICreateUserInput
): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    const { email, is_admin, password } = createUserInput;
    const user = await User.findOne({ email })
      .then(result => result)
      .catch(err => console.log(err.message));
    if (user) {
      return false;
    } else {
      const newUser = is_admin
        ? new User({ email, is_admin })
        : new User({ email });
      return resolve(hashPassword(newUser, password));
    }
  });
};

export const login = (email, password, req): Promise<IUserModel | Error> => {
  // console.log("Login is running.");
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info, status) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject("User does not exist.");
      }
      // console.log("this is the req.session: ", req.session);
      req.session.save(error => {
        if (error) {
          return reject(error);
        }
      });
      // console.log("logging in user: ", user);
      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
};

// will return email indication for client to redirect to protected resources
export const updatePassword = (
  email,
  oldPassword,
  newPassword
): Promise<string | IUserModel> => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user: any) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject("User does not exist.");
      }
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return reject("Incorrect password.");
      }
      return resolve(hashPassword(user, newPassword));
    });
  });
};

export const adminUpdatePassword = (
  email,
  newPassword
): Promise<string | IUserModel> => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user: any) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject("User does not exist.");
      }
      return resolve(hashPassword(user, newPassword));
    });
  });
};
