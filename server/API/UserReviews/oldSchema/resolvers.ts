// import { IUserReviewModel } from "../Models/userReview";
import { customDateScalarType } from "../../CustomScalars/customDateScalarType";
import {
  allUserReviews,
  createReview
  // updateReview,
  // deleteReview
} from "../Services";

const resolvers = {
  Query: {
    allUserReviews: () => {
      console.log("RUNNING GET ALL USER REVIEWS");
      return allUserReviews();
    }
  },
  Mutation: {
    // Promise<IUserReviewModel | Error>
    createUserReview: (
      parentValue,
      { rating, comment, product_reviewed },
      { req }
    ): any => {
      return createReview({ rating, comment, product_reviewed }, req);
    }
  }
};

export default resolvers;

// Just adding this to the resolver didn't raise any issues
// Date: {
//   __serialize(value) {
//     return value; // value sent to the client
//   },

//   __parseValue(value) {
//     return value;
//   },
//   __parseLiteral(ast) {
//     return JSON.parse(JSON.stringify(ast)).value;
//   }
// }

// //  Promise<IUserReviewModel | Error>
// updateUserReview: (
//   parentValue,
//   { reviewId, rating, comment },
//   { req }
// ): any => {
//   const args = { reviewId, rating, comment, req };
//   return updateReview(args);
// },
// deleteUserReview: (parentValue, { reviewId }, { req }): any => {
//   return deleteReview(reviewId, req);
// }
