// import * as mongoose from 'mongoose';
// import { initMongoMongooseConnection } from '../../Middleware';
// import { compareUserPassword, dropUserCollection, terminateDBConnection } from './test-helpers';
// import { createUser, updatePassword } from '../auth';
// import { User } from '../../API/Accounts/Models/user';

// beforeAll(async () => {
//   await initMongoMongooseConnection();
// });

// beforeEach(async () => {
//   await dropUserCollection();
// });

// afterAll(async (done) => {
//   await dropUserCollection();
//   await terminateDBConnection();
//   done();
// });

// test('Returns an empty collection if no users have been created', async () => {
//   expect.assertions(1);
//   const user = await User.find({}).then((results) => results);
//   expect(user).toEqual([]);
// });

// test('Successfully creates a user and hashes the password', async () => {
//   expect.assertions(2);
//   const user = await createUser('richard@gmail.com', 'password');
//   const passwordMatches = await compareUserPassword('richard@gmail.com', 'password');
//   if (user) {
//     expect((user as any).email).toEqual('richard@gmail.com');
//   }
//   expect(passwordMatches).toBe(true);
// });

// test(`Successfully updates the user's password`, async () => {
//   expect.assertions(3);
//   const user = await createUser('richard@gmail.com', 'password');
//   const passwordMatches = await compareUserPassword('richard@gmail.com', 'password');
//   expect(passwordMatches).toBe(true);
//   await updatePassword('richard@gmail.com', 'password', 'hasNewPassword');
//   const passwordShouldntMatch = await compareUserPassword('richard@gmail.com', 'password');
//   const passwordShouldMatch = await compareUserPassword('richard@gmail.com', 'hasNewPassword');
//   expect(passwordShouldntMatch).toBe(false);
//   expect(passwordShouldMatch).toBe(true);
// });
test("2+2 equals 4", () => {
  expect(2 + 2).toEqual(4);
});
