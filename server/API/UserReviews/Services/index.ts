import { UserReview } from "../Models/userReview";

export const allUserReviews = async () => {
  return await UserReview.find({})
    .then(results => results)
    .catch(err =>
      console.log("Error retrieving user review list: ", err.message)
    );
};

// Whenever a review is created. Will need to get that Product by id
// so that I may push the new review to it's array which references.
// user reviews.

export const createReview = async (input, req) => {
  const creationDate = Date.now();
  console.log(creationDate);
  const finalInput = { ...input, reviewer: req._id, date: creationDate };
  const userReview = await new UserReview(finalInput);
  await userReview.save();
  console.log("The created user review: ", userReview);
  return userReview;
};

// export const updateReview = async ({ reviewId, rating, comment, req }) => {
//   const retrievedReview = await UserReview.find({ id: reviewId })
//     .then(results => results)
//     .catch(err =>
//       console.log("Error retrieving user in updateReview: ", err.message)
//     );
//   if (retrievedReview) {
//     retrievedReview.review = review;
//   }
//   if (comment) {
//     retrievedReview.comment = comment;
//   }
//   retrievedReview.edited = Date.now();
//   retrievedReview.save();
//   return resolve(retrievedReview);
// };

// export const deleteReview = async (reviewId, req) => {
//   const deletedStatus = await UserReview.deleteOne({ id: reviewId })
//     .then(deleted => console.log("This is deleted: ", deleted))
//     .catch(err =>
//       console.log("Error deleting user in deleteReview: ", err.message)
//     );
//   return true;
// };
