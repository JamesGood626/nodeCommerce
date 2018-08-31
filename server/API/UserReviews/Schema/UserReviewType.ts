export const userReviewTypeDef = `
  type UserReview {
    _id: String!
    reviewer: String!
    rating: Int!
    comment: String!
    date: Date
    edited: Date
    product_reviewed: Product!
  }

  input CreateUserReviewInput {
    rating: Int!
    comment: String!
    product_reviewed: String!
  }

  extend type Query {
    allUserReviews: [UserReview]
  }

  extend type Mutation {
    createReview(input: CreateUserReviewInput): UserReview
  }
`;
