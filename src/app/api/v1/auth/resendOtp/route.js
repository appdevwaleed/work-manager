import { findUserByEmail, findUserByPhone } from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  const { email, phonenumber } = await request.json();
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
    if (user.status !== "Active") {
      return apiResponse(
        errorCodes.badRequest,
        "User not active yet please try agin later"
      );
    }
    user.phoneOtp = await generateRandomCode();
    user.emailOtp = await generateRandomCode();
    console.log("user", user);
    await user.save();
    user = user.toObject();
    user = await excludeKeys(user, [
      // "phoneOtp",
      // "emailOtp",
      "password",
      "refreshToken",
      "accessToken",
      "creationTime",
      "updatetime",
      "emailVerified",
      "phoneVerified",
      "deviceType",
      "deviceId",
      "employmentStatus",
      "userStatus",
    ]);
    let message = email
      ? "Otp sent on your provided " + email
      : "Otp sent on your provided " + phonenumber;
    return apiResponse(errorCodes.successResponse, message, user);
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
