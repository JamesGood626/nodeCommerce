import * as repl from 'repl';
import * as readline from 'readline';
import { initMongoMongooseConnection } from './Middleware';
import { createSuperUser } from './Services/auth';

const superUserConfig = { username: '', password: '' };

const replServer = repl.start({ prompt: '$ ' });
replServer.defineCommand('createsuperuser', async function action(this: typeof replServer) {
  await getSuperUserCredentials.call(this);
  await initDBAndCreateSuperUser.call(this);
});

function getSuperUserCredentials(this: typeof replServer) {
  return new Promise(async (resolve, reject) => {
    const usernameResult = await readUsername.call(this);
    const passwordResult = await readPassword.call(this);
    // Will add further validation.
    (typeof usernameResult === 'string' && typeof passwordResult === 'string')
      ? resolve()
      : reject("You must enter a string.");
  });
}

function readUsername() {
  return new Promise(async (resolve, reject) => {
    return replServer.question('Enter your username: ', async (username) => {
      superUserConfig.username = username;
      resolve(username);
    });
  });
}

function readPassword() {
  return new Promise(async (resolve, reject) => {
    return replServer.question('Enter your password: ', async (password) => {
      superUserConfig.password = password;
      resolve(password);
    });
  });
}

function initDBAndCreateSuperUser(this: typeof replServer) {
  return new Promise(async (resolve, reject) => {
    await initMongoMongooseConnection();
    await createSuperUser(superUserConfig.username, superUserConfig.password);
    this.displayPrompt();
    resolve();
  });
}
