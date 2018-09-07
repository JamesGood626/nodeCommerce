import { isAdmin } from "../../middlewareResolvers";
import { allCategories, createCategory, deleteCategory } from "../Services";

export const categoryResolvers = {
  Query: {
    allCategories: async (_, __, { req }) => {
      return await allCategories();
    }
  },
  Mutation: {
    createCategory: async (_, { category_type }, { req }) => {
      isAdmin(req.user);
      return await createCategory({ category_type });
    },
    deleteCategory: async (_, { _id }, { req }) => {
      isAdmin(req.user);
      return await deleteCategory(_id);
    }
  }
};
