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
  phonOtp: Number,
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
