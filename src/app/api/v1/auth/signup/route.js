// /pages/api/auth/signup.js
import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
  findUserByPhone,
} from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  const { fname, lname, email, phonenumber } = await request.json();
  if (!email || !phonenumber) {
    return apiResponse(
      errorCodes.badRequest,
      "email or phonenumber is required"
    );
  }
  const existingUser = await findUserByPhone(phonenumber);

  if (existingUser) {
    return apiResponse(errorCodes.badRequest, "User already exists");
  }
  // const hashedPassword = await bcrypt.hash(password, 12);
  try {
    let newUser = await createUser({
      fname,
      lname,
      email,
      phonenumber,
      // password: hashedPassword,
    });
    const accessToken = await generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;
    await newUser.save();
    newUser = newUser.toObject();
    return apiResponse(
      errorCodes.createdSuccess,
      "User created successfully",
      newUser
    );
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      errorCodes?.methodNotAllowed,
      "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
