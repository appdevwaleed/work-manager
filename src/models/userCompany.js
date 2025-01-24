import mongoose, { Schema } from "mongoose";
import {
  user_com_roles,
  def_user_com_role,
  user_com_status,
  def_user_com_status,
} from "../constants/enums";
const userCompanySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  roles: [
    {
      type: String,
      enum: user_com_roles,
    },
  ],
  status: {
    type: String,
    enum: user_com_status,
    default: def_user_com_status,
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creationTime: { type: Date, default: Date.now },
  updatetime: { type: Date, default: Date.now },
});

export const UserCompany =
  mongoose.models.UserCompany ||
  mongoose.model("UserCompany", userCompanySchema);
