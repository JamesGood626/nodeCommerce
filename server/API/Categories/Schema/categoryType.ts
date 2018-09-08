import { gql } from "apollo-server-express";

export const categoryTypeDef = gql`
  type Category {
    _id: String!
    category_type: String!
  }

  input CreateCategoryInput {
    category_type: String!
  }

  input DeleteCategoryInput {
    _id: String!
  }

  extend type Query {
    allCategories: [Category]
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput): Category
    deleteCategory(input: DeleteCategoryInput): Boolean
  }
`;
