import UserTypeDef from '../../Accounts/Schema/userType';

const UserReviewTypeDef = `
  type UserReview {
    id: Int!
    reviewer: User!
    rating: Int!
    comment: String!
    date: Date
    edited: Date
  }
`;

export default [ UserReviewTypeDef, UserTypeDef ];
