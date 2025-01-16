import mongoose from "mongoose";
export const sortCategories = async () => {
  let sortData = [];
};
export const buildTree = (data, parentId = null) => {
  return data
    .filter((item) => item.parentId === parentId && item.status == "active")
    .map((item) => ({
      ...item,
      children: buildTree(data, item.randomId), // Recursively find children
    }));
};
