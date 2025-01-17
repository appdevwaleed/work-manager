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
  const { email, phonenumber, password } = await request.json();
  if (!email || !password) {
    return apiResponse(
      errorCodes.badRequest,
      "Please provide both email and password",
      error
    );
  }

  try {
    let user = await findUserByEmail(email);
    let userByPhone = await findUserByPhone(phonenumber);
    if (!user && !userByPhone) {
      return apiResponse(
        errorCodes.badRequest,
        "Invalid phonenumber address",
        error
      );
    }
    console.log("user", user);
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiResponse(errorCodes.badRequest, "Invalid password", error);
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();
    user = user.toObject();
    return apiResponse(errorCodes.successResponse, "SignIn successfully", user);
  } catch (error) {
    return apiResponse(
      errorCodes.methodNotAllowed,
      "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
