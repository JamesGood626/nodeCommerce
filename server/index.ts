import * as express from 'express';
import {
  initBodyParser,
  initRedisSessionStore,
  initPassport,
  initMongoMongooseConnection,
  initGraphQL
} from './Middleware';
import { authRouter } from './Router/authRouter';
import { initAdmin } from './Utils/initAdmin';
import { User, userSchema } from './API/Accounts/Models/user';
import { BillingInfo, billingInfoSchema } from './API/BillingInfo/Models/billingInfo';
import { Cart, cartSchema } from './API/Cart/Models/cart';
import { Product, productSchema } from './API/Products/Models/product';
import { UserReview, userReviewSchema } from './API/UserReviews/Models/userReview';

export const app = express();

// You can use this to access the properties.
// I think this invalidates Passing User to the config.
// But it may be necessary for admin to perform CRUD?
const keys = Object.getOwnPropertyNames(userSchema.obj);
keys.map((key) => {
  console.log('THESE ARE THE USER SCHEMA KEYS! ', key);
});
console.log('AND END');

const adminConfig = [
  ['User', userSchema],
  ['BillingInfo',  billingInfoSchema],
  ['Cart', cartSchema],
  ['Product', productSchema],
  ['UserReview', userReviewSchema]
];

app.set('view engine', 'pug');
app.set('views', './server/views');
initBodyParser(app);
initRedisSessionStore(app);
initPassport(app);
initMongoMongooseConnection();
initGraphQL(app);
authRouter(app);
initAdmin(adminConfig);

app.listen(5000, () => {
  console.log('Listening');
});