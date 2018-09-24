import { isUserAuthenticated, isAdmin } from "../../middlewareResolvers";
import {
  allUserReviews,
  createReview,
  editReview,
  deleteReview
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
      isUserAuthenticated(req.user);
      return await createReview(
        {
          rating,
          comment,
          product_reviewed
        },
        req.user
      );
    },
    editReview: async (_, { input: { _id, rating, comment } }, { req }) => {
      isUserAuthenticated(req.user);
      return await editReview(
        {
          _id,
          rating,
          comment
        },
        req.user
      );
    },
    deleteReview: async (_, { input: { _id } }, { req }) => {
      isUserAuthenticated(req.user);
      return await deleteReview(
        {
          _id
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
