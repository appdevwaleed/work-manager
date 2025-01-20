import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  parentId: {
    type: Number, //mongoose.ObjectId
    default: null,
  },
  leftCatId: {
    type: Number,
    default: null,
  },
  randomId: {
    type: Number, //This id we will use for parent id in child categories 16 numbers
    unique: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  },
  byRadius: {
    type: Boolean,
    default: true,
  }, //if true means we category should be active within that radius otherwise we will follow bounds stratergy
  radius: {
    type: Number,
    default: 10, //10km
  },
  coordinates: [
    {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  ],
});
export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
