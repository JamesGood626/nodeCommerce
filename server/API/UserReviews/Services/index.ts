import { UserReview } from "../Models/userReview";
import { User } from "../../Accounts/Models/user";
import { Product } from "../../Products/Models/product";

const findAndUpdate = async (model, id, input) => {
  return await model.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );
};

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

export const createReview = async (input, user) => {
  const { product_reviewed } = input;
  const creationDate = Date.now();
  const finalInput = {
    ...input,
    product_reviewed,
    reviewer: user._id,
    date: creationDate
  };
  const userReview = await new UserReview(finalInput);
  await userReview.save();
  const retrievedUser = await User.findById(user._id).then(result => result);
  const retrievedProduct = await Product.findById(product_reviewed).then(
    result => result
  );
  (retrievedUser as any).user_reviews.push(userReview._id);
  (retrievedUser as any).save();
  (retrievedProduct as any).user_reviews.push(userReview._id);
  (retrievedProduct as any).save();
  return userReview;
};

export const editReview = async (input, user) => {
  const { _id } = input;
  const userReviewIsOwn = user.user_reviews.filter(review => {
    if (review.toString() === _id) {
      return true;
    }
  });
  if (userReviewIsOwn.length > 0) {
    const updatedReview = await findAndUpdate(UserReview, _id, input);
    return updatedReview;
  }
  return null;
};

// export const deleteReview = async (reviewId, req) => {
//   const deletedStatus = await UserReview.deleteOne({ id: reviewId })
//     .then(deleted => console.log("This is deleted: ", deleted))
//     .catch(err =>
//       console.log("Error deleting user in deleteReview: ", err.message)
//     );
//   return true;
// };
