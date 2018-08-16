// import { makeExecutableSchema } from "graphql-tools";
// import UserTypeDef from "./userType";
// import BillingInfoTypeDef from "../../BillingInfo/Schema/billingInfoType";
// import CartTypeDef from "../../Cart/Schema/cartType";
// import ProductTypeDef from "../../Products/Schema/productType";
// import UserReviewTypeDef from "../../UserReviews/Schema/userReviewType";
// import resolvers from "./resolvers";

// const RootQuery = `
//   type Query {
//     allUsers: [User]
//   }

//   type Mutation {
//     createUser(email: String!, password: String!): User
//   }

//   extend type Mutation {
//     loginUser(email: String!, password: String!): User
//   }

//   extend type Mutation {
//     updatePassword(email: String!, oldPassword: String!, newPassword: String!): User
//   }
// `;

// const SchemaDefinition = `
//   schema {
//     query: Query
//     mutation: Mutation
//   }
// `;
// // UserReviewTypeDef,
// export default makeExecutableSchema({
//   typeDefs: [
//     SchemaDefinition,
//     RootQuery,
//     BillingInfoTypeDef,
//     CartTypeDef,
//     ProductTypeDef,
//     UserTypeDef
//   ],
//   resolvers
// });
