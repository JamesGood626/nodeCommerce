import { initMongoMongooseConnection } from '../../Middleware';
import { compareUserPassword, terminateDBConnection } from './test-helpers';
import { createUser } from '../auth';
import { User } from '../../API/Accounts/Models/user';

beforeAll(async () => {
  await initMongoMongooseConnection();
});

afterAll(async () => {
  await terminateDBConnection();
});

afterEach(async () => {
  await User.collection.drop().catch((err) => console.log(err.message));
});

test('Returns an empty collection if no users have been created', async () => {
  const user = await User.find({}).then((results) => results);
  expect(user).toEqual([]);
});

test('Successfully creates a user and hashes the password', async () => {
  const user = await createUser('richard@gmail.com', 'password');
  const passwordMatches = await compareUserPassword('richard@gmail.com', 'password');
  if (user) {
    expect((user as any).email).toEqual('richard@gmail.com');
  }
  expect(passwordMatches).toBe(true);
});
