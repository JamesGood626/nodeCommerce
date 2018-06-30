// import * as axios from 'axios';
// import * as graphql from 'graphql';
import UserReviewTypeDef from './UserReviewType';
import { makeExecutableSchema } from 'graphql-tools';
// import { createReview } from '../../../Services/userReviewUtils';
// const { 
//   GraphQLObjectType,
//   GraphQLID,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLSchema,
//   GraphQLList,
//   GraphQLNonNull
// } = graphql





// const mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     createReview: {
//       type: UserReviewType,
//       args: {
//         user_id: { type: new GraphQLNonNull(GraphQLID) },
//         rating: { type: new GraphQLNonNull(GraphQLInt) },
//         comment: { type: new GraphQLNonNull(GraphQLInt) }
//       },
//       resolve(parentValue, { rating, comment }) {
//         return createReview(rating, comment)
//       }
//     },
//   }
// })





// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     world: {
//       type: GraphQLString,
//       resolve() {
//         return 'world'
//       }
//     }
//   }
// })

// export const userReviewSchema = new GraphQLSchema({
//   query: RootQuery,
//   mutation
// })

const RootQuery = `
  type RootQuery {
    userReview(id: Int!): UserReview
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, ...UserReviewTypeDef],
  resolvers: {},
});
