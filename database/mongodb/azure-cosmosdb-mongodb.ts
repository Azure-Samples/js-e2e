import { Schema, model, connect } from "mongoose";

const CategorySchema = new Schema(
  { categoryName: String },
  { timestamps: true }
);
const CategoryModel = model("Category", CategorySchema, "Bookstore");

export const init = async () => {
  await connect(process.env["CosmosDbConnectionString"]);
};
export const addItem = async (doc) => {
  const modelToInsert = new CategoryModel();
  modelToInsert["categoryName"] = doc.name;

  return await modelToInsert.save();
};
export const findItemById = async (id) => {
  return await CategoryModel.findById(id);
};
export const findItems = async (query = {}) => {
  return await CategoryModel.find({});
};
export const deleteItemById = async (id) => {
  return await CategoryModel.findByIdAndDelete(id);
};
