import { Document, Schema, Model, model } from "mongoose";

export interface ICategory {
  category_type: string;
}

export interface ICategoryModel extends ICategory, Document {}

export const categorySchema = new Schema({
  category_type: {
    type: String,
    required: true
  }
});

export const Category: Model<ICategoryModel> = model<ICategoryModel>(
  "Category",
  categorySchema
);
