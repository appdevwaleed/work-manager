import mongoose, { Schema } from "mongoose";
import {
  userDeviceType,
  userDeviceType_def,
  userJobRole,
  userJobRole_def,
  userStatus,
  userStatus_def,
} from "@/constants/enums";
const UserSchema = new Schema({
  fname: String,
  lname: String,
  city: String,
  country: String,
  profileUrl: String,

  email: {
    type: String,
    unique: true,
    sparse: true, // Enables unique constraint to ignore null values
  },
  phonenumber: {
    type: String,
    unique: true,
    sparse: true, // Enables unique constraint to ignore null values
  },
  phoneOtp: Number,
  emailOtp: Number,
  password: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  deviceId: {
    type: String,
    default: "ab123",
  },
  deviceType: {
    type: String,
    enum: userDeviceType,
    default: userDeviceType_def,
  },
  jobRole: {
    type: String,
    enum: userJobRole,
    default: userJobRole_def,
  },
  userStatus: {
    type: String,
    enum: userStatus,
    default: userStatus_def,
  },
  creationTime: { type: Date, default: Date.now },
  updatetime: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
