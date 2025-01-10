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
  password: {
    type: String,
    required: [true, "Password is required !!"],
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
