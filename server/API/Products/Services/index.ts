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

export const deleteProduct = ({ product_id }, user) => {
  // if user isn't an admin then don't execute
  console.log("THE USER IN DELETE PRODUCT: ", user);
  if (user._id) {
    console.log("USER ISN'T ADMIN: ", user.is_admin);
    return false;
  }
  return new Promise(async (resolve, reject) => {
    console.log("DELETE BILLING INFO IS BEING CALLED.");
    const productDeleted = await Product.findById(product_id).then(result => {
      if (result) {
        console.log("product to be deleted: ", result);
        return result.remove();
      }
    });
    console.log("ANNND THE PRODUCT DELETED: ", productDeleted);
    return resolve(productDeleted as any);
  });
};
