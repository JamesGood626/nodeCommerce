import { site } from "../Router/adminRouter";

export const initAdmin = (config: any) => {
  config.map(databaseDataInfo => {
    site.register(databaseDataInfo[0], databaseDataInfo[1]);
  });
  // site.logRegistry();
  site.createRoutes();
};
