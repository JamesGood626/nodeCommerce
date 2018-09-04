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
    return review.toString() === _id ? true : false;
  });
  if (userReviewIsOwn.length > 0) {
    const updatedReview = await findAndUpdate(UserReview, _id, input);
    return updatedReview;
  }
  return null;
};

export const deleteReview = async ({ _id }, user) => {
  const userReviewIsOwn = user.user_reviews.filter(review => {
    return review.toString() === _id ? true : false;
  });
  if (userReviewIsOwn.length > 0) {
    const reviewDeleted = await UserReview.findById(_id).then(result => {
      if (result) {
        return result.remove();
      }
    });
    return reviewDeleted as any;
  }
  return null;
};
