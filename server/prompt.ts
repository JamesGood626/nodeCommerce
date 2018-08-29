import * as repl from "repl";
import * as readline from "readline";
import { initMongoMongooseConnection } from "./Middleware";
import { createUser } from "./Services/auth";

const userConfig = { email: "", password: "", is_admin: false };

const replServer = repl.start({ prompt: "$ " });
replServer.defineCommand("createsuperuser", async function action(
  this: typeof replServer
) {
  await getSuperUserCredentials.call(this);
  await initDBAndCreateSuperUser.call(this);
});

function getSuperUserCredentials(this: typeof replServer) {
  return new Promise(async (resolve, reject) => {
    const usernameResult = await readEmail.call(this);
    const passwordResult = await readPassword.call(this);
    const isAdminResult = await readIsAdmin.call(this);
    // Will add further validation.
    typeof usernameResult === "string" && typeof passwordResult === "string"
      ? resolve()
      : reject("You must enter a string.");
  });
}

function readEmail() {
  return new Promise(async (resolve, reject) => {
    return replServer.question("Enter your email: ", async email => {
      userConfig.email = email;
      resolve(email);
    });
  });
}

function readPassword() {
  return new Promise(async (resolve, reject) => {
    return replServer.question("Enter your password: ", async password => {
      userConfig.password = password;
      resolve(password);
    });
  });
}

function readIsAdmin() {
  return new Promise(async (resolve, reject) => {
    return replServer.question("Is user admin?: ", async isAdmin => {
      if (typeof isAdmin === "boolean") {
        userConfig.is_admin = isAdmin;
        resolve(isAdmin);
      }
    });
  });
}

function initDBAndCreateSuperUser(this: typeof replServer) {
  return new Promise(async (resolve, reject) => {
    await initMongoMongooseConnection();
    await createUser(userConfig);
    this.displayPrompt();
    resolve();
  });
}
