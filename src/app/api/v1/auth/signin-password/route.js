import { findUserByEmail, findUserByPhone } from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
  excludeKeys,
  verifyPassword,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  const { email, phonenumber, password } = await request.json();
  if (!email && !phonenumber) {
    return apiResponse(
      errorCodes.badRequest,
      "Please provide email or phonenumber"
    );
  }
  try {
    let user = null;
    if (email) {
      user = await findUserByEmail(email);
    } else if (phonenumber) {
      user = await findUserByPhone(phonenumber);
    }
    if (!user) throw new Error("Provided data is incomplete or not accurate");
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return apiResponse(errorCodes.badRequest, "Password is incorrect");
    }
    if (user.userStatus !== "Active") {
      return apiResponse(errorCodes.badRequest, "User not active");
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    // user.createdby = user?._id;
    // user.updatedBy = user?._id;

    await user.save();
    user = user.toObject();
    user = await excludeKeys(user, [
      "phoneOtp",
      "emailOtp",
      "password",
      "creationTime",
      "updatetime",
      "emailVerified",
      "phoneVerified",
      "deviceType",
      "deviceId",
      "employmentStatus",
      "userStatus",
    ]);
    return apiResponse(errorCodes.successResponse, "Login Successfully", user);
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      errorCodes.methodNotAllowed,
      "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
