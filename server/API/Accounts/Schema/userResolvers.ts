import { IUserModel } from "../Models/user";
import { createUser, login, updatePassword } from "../../../Services/auth";
import { getAllUsers } from "../Services";

// interface IQuery {
//   allUsers: () => Array<{id: number; email: string; password: string; }>;
//   loginUser: (parentValue: any, args: { email: string, password: string}, req: any) => Promise<IUserModel | Error>;
// }

// interface IMutation {
//   createUser(parentValue: any, args: { email: string, password: string}, req: any): any;
//   updatePassword(
//     parentValue: any,
//     args: { email: string, oldPassword: string, newPassword: string},
//     req: any
//   ): any;
// }

// interface IResolvers {
//   Query: object;
//   Mutation: object;
// }
export const userResolvers = {
  Query: {
    allUsers: (_, ___, { req }) => {
      return getAllUsers();
    }
  },
  Mutation: {
    createUser: (parentValue, { email, password }): any => {
      return createUser(email, password);
    },
    loginUser: (
      parentValue,
      { email, password },
      { req }
    ): Promise<IUserModel | Error> => {
      return login(email, password, req);
    },
    updatePassword: (parentValue, { email, oldPassword, newPassword }): any => {
      return updatePassword(email, oldPassword, newPassword);
    }
  }
};
