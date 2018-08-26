// import { User } from "../../Accounts/Models/user";
import { User } from "../../Accounts/Models/user";
import { Product, IProduct, IProductModel } from "../Models/product";

export const getAllProducts = async () => {
  const allProducts: IProductModel[] = await Product.find({}).then(
    result => result
  );
  return allProducts;
};

export const createProduct = (input, user) => {
  return new Promise(async (resolve, reject) => {
    const product = new Product(input);
    await product.save();
    return resolve(product);
  });
};

export const editProduct = async (input, user) => {
  return new Promise(async (resolve, reject) => {
    const { product_id } = input;
    const product = await Product.findByIdAndUpdate(
      product_id,
      { $set: input },
      { new: true },
      (err, product) => {
        if (err) {
          return console.log(err);
        }
        return product;
      }
    );
    return resolve(product as any);
  });
};

// export const deleteBillingInfo = user => {
//   return new Promise(async (resolve, reject) => {
//     console.log("DELETE BILLING INFO IS BEING CALLED.");
//     const retrievedUser = await User.findOne({ email: user.email }).then(
//       result => result
//     );
//     (retrievedUser as any).billing_info.remove();
//     await (retrievedUser as any).save().catch(err => {
//       console.log("ERROR SAVING UPDATED USER WITH NEW BILLING INFO: ", err); // TODO: Handle Error
//     });
//     return resolve(retrievedUser as any);
//   });
// };
