import { IUserReviewModel } from '../Models/userReview';
import {
  retrieveUserReviews,
  createReview,
  updateReview,
  deleteReview
} from '../Services';

const resolvers = {
  Query: {
    allUserReviews: () => {
      console.log("RUNNING GET ALL USER REVIEWS");
      return retrieveUserReviews();
    }
  },
  Mutation: {
    // Promise<IUserReviewModel | Error>
    createUserReview: (parentValue, { rating, comment }, { req }): any => {
      return createReview(rating, comment, req);
    },
    //  Promise<IUserReviewModel | Error>
    updateUserReview: (parentValue, { reviewId, rating, comment }, { req }): any => {
      const args = { reviewId, rating, comment, req };
      return updateReview(args);
    },
    deleteUserReview: (parentValue, { reviewId }, { req }): any => {
      return deleteReview(reviewId, req);
    }
  }
};

export default resolvers;

