import * as express from "express";
import * as mongoose from "mongoose";
import {
  initBodyParser,
  initRedisSessionStore,
  initPassport,
  initMongoMongooseConnection,
  initGraphQL
} from "./Middleware";
import { authRouter } from "./Router/authRouter";
import { initAdmin } from "./Utils/initAdmin";
import { User, userSchema } from "./API/Accounts/Models/user";
import {
  BillingInfo,
  billingInfoSchema
} from "./API/BillingInfo/Models/billingInfo";
import { Cart, cartSchema } from "./API/Cart/Models/cart";
import { Product, productSchema } from "./API/Products/Models/product";
import {
  UserReview,
  userReviewSchema
} from "./API/UserReviews/Models/userReview";

export const app = express();

const adminConfig = [
  ["User", userSchema],
  ["BillingInfo", billingInfoSchema],
  ["Cart", cartSchema],
  ["Product", productSchema],
  ["UserReview", userReviewSchema]
];

app.set("view engine", "pug");
app.set("views", "./views");
initBodyParser(app);
initRedisSessionStore(app);
initPassport(app);
initMongoMongooseConnection();
initGraphQL(app);
authRouter(app);
initAdmin(adminConfig);
