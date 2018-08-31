import { isUserAuthenticated, isAdmin } from "../../middlewareResolvers";
import {
  allUserReviews,
  createReview
  // editUserReview,
  // deleteUserReview
} from "../Services";

export const userReviewResolvers = {
  Query: {
    allUserReviews: (_, __, { req }): any => {
      return allUserReviews();
    }
  },
  Mutation: {
    createReview: async (
      _,
      { input: { rating, comment, product_reviewed } },
      { req }
    ) => {
      console.log("Create review resolver is hit: ", req.user);
      isUserAuthenticated(req.user);
      return await createReview(
        {
          rating,
          comment,
          product_reviewed
        },
        req.user
      );
    }
  }
};

// editUserReview: async (
//   _,
//   {
//     input: {
//       rating,
//       comment,
//       product_reviewed
//     }
//   },
//   { req }
// ) => {
//   isAdmin(req.user);
//   return await editUserReview(
//     {
//       rating,
//       comment,
//       product_reviewed
//     },
//     req.user
//   );
// },
// deleteUserReview: async (_, { input: { user_review_id } }, { req }) => {
//   isAdmin(req.user);
//   return await deleteUserReview(
//     {
//       user_review_id
//     },
//     req.user
//   );
// }
