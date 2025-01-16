import bcrypt from "bcryptjs";
const { User } = require("../models/user");
import { connectDb } from "./dbConnect";
connectDb();

// Function to find a user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Function to find a user by ID
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Function to create a new user
export const createUser = async ({
  fname,
  lname,
  email,
  phonenumber,
  password,
}) => {
  const user = new User({
    fname,
    lname,
    email,
    phonenumber,
    password,
  });

  await user.save();
  return user;
};

// Function to check if password is correct
export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
