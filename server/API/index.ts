// import { mergeSchemas } from "graphql-tools";
// import userSchema from "./Accounts/Schema";
// import BillingInfoSchema from "./BillingInfo/Schema";
// import CartSchema from "./Cart/Schema";
// import ProductSchema from "./Products/Schema";
// import userReviewSchema from "./UserReviews/Schema";
// import { DateScalarSchema } from "./CustomScalars/customDateScalarType";

import { gql } from "apollo-server-express";
import { userTypeDef } from "./Accounts/Schema/userType";
import { userResolvers } from "./Accounts/Schema/userResolvers";
import { billingInfoTypeDef } from "./BillingInfo/Schema/billingInfoType";
import { billingInfoResolvers } from "./BillingInfo/Schema/billingInfoResolvers";
import { cartTypeDef } from "./Cart/Schema/cartType";
import { cartResolvers } from "./Cart/Schema/cartResolvers";
import { productTypeDef } from "./Products/Schema/productType";
import { productResolvers } from "./Products/Schema/productResolvers";
// import { userReviewTypeDef } from "./UserReviews/Schema/userReviewType";
// import { userReviewResolvers } from "./userReviews/Schema/userReview";
import {
  dateScalarSchema,
  dateScalarResolver
} from "./CustomScalars/customDateScalarType";

const typeDef = gql`
  input BillingInfoInput {
    street_address: String!
    apartment: String
    city: String!
    state: String
    zip: String
    country: String!
  }

  input CartInput {
    id: Int!
    total_price_amount: Int!
    products: [ProductInput!]!
    discount: Int
    total_price_with_discount: Int
  }

  input ProductInput {
    product_title: String!
    description: String!
    price: Int!
    sale_price: Int
    sale_price_start: Date
    sale_price_expiry: Date
    shipping_time: String
    images: [String!]!
  }

  type Query {
    allUsers: [User]
    allBillingInfo: [BillingInfo]
    allCarts: [Cart]
    allProducts: [Product]
  }

  type Mutation {
    createUser(email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    updatePassword(
      email: String!
      oldPassword: String!
      newPassword: String!
    ): User
    createBillingInfo(input: BillingInfoInput): BillingInfo
    editBillingInfo(input: BillingInfoInput): BillingInfo
    deleteBillingInfo: User
    createCart(input: CartInput): User
    createProduct(input: ProductInput): Product
  }
`;

// the type signature of any is required for these arrays
export const typeDefs: any = [
  typeDef,
  userTypeDef,
  billingInfoTypeDef,
  cartTypeDef,
  productTypeDef,
  dateScalarSchema
];

export const resolvers: any = [
  userResolvers,
  billingInfoResolvers,
  cartResolvers,
  productResolvers,
  dateScalarResolver
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
