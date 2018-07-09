import { UserReview } from '../Models/userReview';

export const retrieveUserReviews = async () => {
  return await UserReview.find({})
    .then((results) => results)
    .catch((err) => console.log("Error retrieving user review list: ", err.message));
}

export const createReview = async (rating, comment, req) => {
  return await new UserReview({ rating, comment, reviewer: req.user._id });
}

export const updateReview = async ({ reviewId, rating, comment, req }) => {
  const retrievedReview = await UserReview.find({ id: reviewId })
    .then((results) => results)
    .catch((err) => console.log("Error retrieving user in updateReview: ", err.message));
    if (review) { retrievedReview.review = review; }
    if (comment) { retrievedReview.comment= comment; }
    retrievedReview.edited = Date.now();
    retrievedReview.save();
  return resolve(retrievedReview);
}

export const deleteReview = async (reviewId, req) => {
  const deletedStatus = await UserReview.deleteOne({ id: reviewId })
    .then((deleted) => console.log("This is deleted: ", deleted))
    .catch((err) => console.log("Error deleting user in deleteReview: ", err.message));
  return true
}