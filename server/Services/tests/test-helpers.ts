import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { User } from '../../API/Accounts/Models/user';

export const terminateDBConnection = async () => {
  await mongoose.connection.close().catch((err) => console.log("Error closing DB connection: ", err.message));
};

export const dropUserCollection = async () => {
  await User.remove({}, (err) => console.log('User Collection Drop Error: ', err));
};

export const compareUserPassword = async (email, password) => {
  const retrievedUser = await User.findOne({ email }, (err: any, user: any) => user);
  if (retrievedUser) {
    return await bcrypt.compareSync(password, retrievedUser.password);
  }
  return false;
};
