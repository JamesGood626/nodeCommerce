import * as bcrypt from "bcrypt";
import * as passport from "passport";
import { hashPassword } from "./bcryptUtils";
import { Model } from "mongoose";
import { User, IUserModel } from "../API/Accounts/Models/user";
import { SuperUser, ISuperUserModel } from "../API/SuperUser/Models/superUser";

export const createUser = (
  email: string,
  password: string
): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email })
      .then(result => result)
      .catch(err => console.log(err.message));
    if (user) {
      return false;
    } else {
      const newUser = new User({ email });
      return resolve(hashPassword(newUser, password));
    }
  });
};

export const createSuperUser = (
  username: string,
  password: string
): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    await User.findOne({ username }, (err, user) => {
      // figure out how to properly handle the two if cases for client side
      if (err) {
        return err;
      }
      if (user) {
        return false;
      }
      const newSuperUser = new SuperUser({ username });
      resolve(hashPassword(newSuperUser, password));
    });
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
): Promise<string | IUserModel | ISuperUserModel> => {
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
): Promise<string | IUserModel | ISuperUserModel> => {
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
