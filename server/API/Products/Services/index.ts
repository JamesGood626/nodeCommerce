import { Product, IProductModel } from "../Models/product";

export const getAllProducts = async () => {
  const allProducts: IProductModel[] = await Product.find({});
  return allProducts;
};

export const createProduct = input => {
  return new Promise(async (resolve, reject) => {
    const product = new Product(input);
    await product.save();
    return resolve(product);
  });
};

export const editProduct = async input => {
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

export const deleteProduct = ({ product_id }) => {
  return new Promise(async (resolve, reject) => {
    const productDeleted = await Product.findById(product_id).then(result => {
      if (result) {
        return result.remove();
      }
      return;
    });
    return resolve(productDeleted as any);
  });
};
