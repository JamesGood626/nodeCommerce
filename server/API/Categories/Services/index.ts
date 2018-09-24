import { Category, ICategory, ICategoryModel } from "../Models/category";

export const allCategories = async () => {
  const allCategories = await Category.find({});
  return allCategories;
};

export const createCategory = input => {
  return new Promise(async (resolve, reject) => {
    const category = new Category(input);
    await category.save();
    return resolve(category);
  });
};

export const deleteCategory = ({ _id }) => {
  return new Promise(async (resolve, reject) => {
    const categoryDeleted = await Category.findById(_id).then(result => {
      if (result) {
        return result.remove();
      }
      return;
    });
    return resolve(categoryDeleted as any);
  });
};
