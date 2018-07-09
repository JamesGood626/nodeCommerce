import { IUserModel } from '../Models/user';
import {
  createUser,
  login,
  updatePassword
} from '../../../Services/auth';

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
const resolvers = {
  Query: {
    allUsers: () => {
      console.log("RUNNING ALL USERS");
      return [
                { id: 1, email: 'jenny@gmail.com', password: 'pw' },
                { id: 2, email: 'jimmy@gmail.com', password: 'pw' },
                { id: 3, email: 'jean@gmail.com', password: 'pw' }
             ];
    }
  },
  Mutation: {
    createUser: (parentValue, { email, password }): any => {
      return createUser(email, password);
    },
    loginUser: (parentValue, { email, password }, { req }): Promise<IUserModel | Error> => {
      return login(email, password, req);
    },
    updatePassword: (parentValue, { email, oldPassword, newPassword }): any => {
      return updatePassword(email, oldPassword, newPassword);
    }
  }
};

export default resolvers;
