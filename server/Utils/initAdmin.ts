import { site } from '../Router/adminRouter';
import { Document, Schema, Model, model} from 'mongoose';

// const adminConfig = [
//   ['User', User],
//   ['BillingInfo', BillingInfo],
//   ['Cart', Cart],
//   ['Products', Product],
//   ['UserReviews', UserReview]
// ];
// type adminConfig = Array<[[string, Model<Document>]]>;

export const initAdmin = (config: any) => {
  config.map((databaseDataInfo) => {
    site.register(databaseDataInfo[0], databaseDataInfo[1]);
  });
  site.logRegistry();
  site.createRoutes();
};
