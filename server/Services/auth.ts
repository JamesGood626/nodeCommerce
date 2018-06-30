import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import { hashPassword } from './bcryptUtils';
import { Model } from 'mongoose';
import { User, IUserModel } from '../API/Accounts/Models/user';
import { SuperUser, ISuperUserModel } from '../API/SuperUser/Models/superUser';

export const createUser = (email: string, password: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      // figure out how to properly handle the two if cases for client side
      if (err) { return err; }
      if (user) {
        return false;
      }
      const newUser = new User({ email });
      resolve(hashPassword(newUser, password));
    });
  });
};

export const createSuperUser = (username: string, password: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, user) => {
      // figure out how to properly handle the two if cases for client side
      if (err) { return err; }
      if (user) {
        return false;
      }
      console.log("HERE'S THE USERNAME: ", username);
      const newSuperUser = new SuperUser({ username });
      console.log("HERE'S THE NEW SUPER USER: ", newSuperUser);
      resolve(hashPassword(newSuperUser, password));
    });
  });
};

export const login = (email, password, req): Promise<IUserModel | Error> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user, info, status) => {
      if (err) { return reject(err); }
      if (!user) { return reject('User does not exist.'); }
      console.log('this is the req.session: ', req.session);
      req.session.save((error) => {
        if (error) {
          return reject(error);
        }
      });
      console.log('logging in user: ', user);
      req.login(user, () => resolve(user));
    })({ body: { email, password }});
  });
};

// will return email indication for client to redirect to protected resources
export const updatePassword =
(email, oldPassword, newPassword): Promise<string | Model<IUserModel> | Model<ISuperUserModel>> => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user: any) => {
      if (err) { return reject(err); }
      if (!user) {
        return reject('User does not exist.');
      }
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return reject('Incorrect password.');
      }
      return resolve(hashPassword(user, newPassword));
    });
  });
};