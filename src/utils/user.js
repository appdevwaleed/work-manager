import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { User } = require("../models/user");
import { connectDb } from "../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
} from "../utils/common";
import { errorCodes } from "../constants/errorKeys";

connectDb();

// Function to find a user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Function to find a user by email
export const findUserByPhone = async (phonenumber) => {
  return await User.findOne({ phonenumber });
};

// Function to find a user by ID
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Function to create a new user
export const createUser = async ({ fname, lname, email, phonenumber }) => {
  const user = new User({
    fname,
    lname,
    email,
    phonenumber,
  });

  await user.save();
  return user;
};

// Function to check if password is correct
export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      let user = await findUserById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        resolve({
          status: errorCodes.badRequest,
          message: "refresh token is not valid",
        });
      }
      const accessToken = await generateAccessToken(user);
      user.accessToken = accessToken;
      user.save();
      resolve({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};
