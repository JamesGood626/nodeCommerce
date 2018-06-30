// import * as graphql from 'graphql';
// const { 
//   GraphQLObjectType,
//   GraphQLID,
//   GraphQLString,
//   GraphQLInt
// } = graphql

// export const UserReviewType = new GraphQLObjectType({
//   name: 'UserReview',
//   fields: () => ({
//     id: { type: GraphQLString },
//     // I suspect that this isn't the correct type
//     user_id: { type: GraphQLID },
//     // Perhaps this is a case for enum?
//     rating: { type: GraphQLInt },
//     comment: { type: GraphQLInt },
//     date: { type: GraphQLString }
//   })
// })

import UserTypeDef from '../../Accounts/Schema/userType';

const UserReviewTypeDef = `
  type UserReview {
    id: Int!
    user: User!
    rating: Int!
    comment: String!
    date: String!
  }
`;

export default [ UserReviewTypeDef, UserTypeDef ];
