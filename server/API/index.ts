import { gql } from "apollo-server-express";
import { userTypeDef } from "./Accounts/Schema/userType";
import { userResolvers } from "./Accounts/Schema/userResolvers";
import { billingInfoTypeDef } from "./BillingInfo/Schema/billingInfoType";
import { billingInfoResolvers } from "./BillingInfo/Schema/billingInfoResolvers";
import { cartTypeDef } from "./Cart/Schema/cartType";
import { cartResolvers } from "./Cart/Schema/cartResolvers";
import { orderTypeDef } from "./Orders/Schema/orderType";
import { orderResolvers } from "./Orders/Schema/orderResolvers";
import { categoryTypeDef } from "./Categories/Schema/CategoryType";
import { categoryResolvers } from "./Categories/Schema/CategoryResolvers";
import { productTypeDef } from "./Products/Schema/productType";
import { productResolvers } from "./Products/Schema/productResolvers";
import { userReviewTypeDef } from "./UserReviews/Schema/userReviewType";
import { userReviewResolvers } from "./UserReviews/Schema/userReviewResolvers";
import {
  dateScalarSchema,
  dateScalarResolver
} from "./CustomScalars/customDateScalarType";
import {
  rawScalarSchema,
  rawScalarResolver
} from "./CustomScalars/customRawScalarType";

const typeDef = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

// the type signature of any is required for these arrays
export const typeDefs: any = [
  typeDef,
  userTypeDef,
  billingInfoTypeDef,
  cartTypeDef,
  orderTypeDef,
  categoryTypeDef,
  productTypeDef,
  userReviewTypeDef,
  dateScalarSchema,
  rawScalarSchema
];

export const resolvers: any = [
  userResolvers,
  billingInfoResolvers,
  cartResolvers,
  orderResolvers,
  productResolvers,
  categoryResolvers,
  userReviewResolvers,
  dateScalarResolver,
  rawScalarResolver
];

// The V1 Apollo Server way
// userReviewSchema
// export const MergedGraphQLSchema = mergeSchemas({
//   schemas: [
//     userSchema,
//     BillingInfoSchema,
//     CartSchema,
//     ProductSchema,
//     DateScalarSchema
//   ]
// });
