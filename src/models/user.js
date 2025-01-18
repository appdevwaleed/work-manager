import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required !!"],
  },
  phonenumber: {
    type: String,
    unique: true,
    required: [true, "Phone number is required !!"],
  },
  phoneOtp: Number,
  emailOtp: Number,
  password: {
    type: String,
    default: "12345678",
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
  deviceType: {
    type: String,
    enum: ["phone", "system"],
    default: "phone",
  },
  deviceId: {
    type: String,
    default: "ab123",
  },
  jobRole: {
    type: String,
    enum: ["employee", "employer", "rider", "admin"],
    default: "rider",
    required: [true, "jobRole is required !!"],
  },
  city: String,
  country: String,
  companyName: String,
  companyAddress: String,
  companyCity: String,
  companyCountry: String,
  profileUrl: String,
  employmentStatus: {
    type: String,
    enum: [
      "new", //inside country but new
      "employed", //wokring for company
      "resigned", //on notice period but inside country
    ],
    default: "employed",
  },
  experience: Number, //1 means 1 year 2 means 2 years,
  description: String, //any description related to your job or you want to show employer
  userStatus: {
    type: String,
    enum: [
      "active",
      "Inactive",
      "blocked",
      "DeletedByCompany",
      "DeletedbyHimSelf",
      "inProcess",
      "rejected",
    ],
    default: "inProcess",
  },
  //   userType: {
  //     type: String,
  //     enum: ["employee", "employer", "rider", "admin"],
  //     default: "employee",
  //   },
  creationTime: { type: Date, default: Date.now },
  updatetime: { type: Date, default: Date.now },
});

export const User =
  mongoose.models.users || mongoose.model("users", UserSchema);
