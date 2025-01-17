import {
  companyMainTypeEnum,
  companySubTypeEnum,
  companyStatus,
} from "@/constants/enums";
import mongoose, { Schema } from "mongoose";
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required for company!!"],
  },
  city: {
    type: String,
    required: [true, "city is required for company!!"],
  },
  country: {
    type: String,
    required: [true, "country is required for company!!"],
  },
  address: {
    type: String,
    required: [true, "address is required for company!!"],
  },
  mainType: {
    type: String,
    enum: companyMainTypeEnum,
    default: "product",
  },
  subType: {
    type: String,
    enum: companySubTypeEnum,
    default: "company",
  },
  parentCompany: {
    type: Number, //parent company id mongoose.ObjectId
    unique: true,
    default: null,
    sparse: true, // Enables unique constraint to ignore null values
  },
  status: {
    type: String,
    enum: companyStatus,
    default: "active",
  },
});

export default mongoose.models.Company ||
  mongoose.model("Company", CompanySchema);
