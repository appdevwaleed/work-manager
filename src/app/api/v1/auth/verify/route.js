import { findUserById } from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
  excludeKeys,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  const { otp, userId, type } = await request.json();
  if (!otp) {
    return apiResponse(errorCodes.badRequest, "Please enter the otp");
  }
  try {
    let user = null;
    if (otp) {
      user = await findUserById(userId);
    }
    if (!user) {
      return apiResponse(errorCodes.badRequest, "user not found");
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    if (type == "phonenumber" && otp === user.phoneOtp) {
      user.phoneOtp = 0;
      user.phoneVerified = true;
    } else if (type == "email" && otp === user.emailOtp) {
      user.emailOtp = 0;
      user.emailVerified = true;
    } else {
      return apiResponse(errorCodes.badRequest, "Provided Otp is not matching");
    }
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
    return apiResponse(
      errorCodes.successResponse,
      "Verification done successfully",
      user
    );
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
