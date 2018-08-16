import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation createUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword(
    $email: String!
    $oldPassword: String!
    $newPassword: String!
  ) {
    updatePassword(
      email: $email
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      email
    }
  }
`;

export const CREATE_USER_REVIEW = gql`
  mutation createUserReview($review: String!, $comment: String!) {
    createUserReview(review: $review, comment: $comment) {
      id
      reviewer
      rating
      comment
      date
    }
  }
`;

export const DELETE_USER_REVIEW = gql`
  mutation deleteUserReview($reviewId: Int!) {
    deleteUserReview(reviewId: $reviewId) {
      boolean
    }
  }
`;
