import * as express from "express";
import * as mongoose from "mongoose";
import {
  initBodyParser,
  initRedisSessionStore,
  initPassport,
  initMongoMongooseConnection,
  initGraphQL
} from "./Middleware";
import { productRouter } from "./Router/productRouter";

export const app = express();

initBodyParser(app);
initRedisSessionStore(app);
initPassport(app);
initMongoMongooseConnection();
export const graphQLServer = initGraphQL(app);
productRouter(app);
