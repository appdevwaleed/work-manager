// /pages/api/auth/signup.js
import bcrypt from "bcryptjs";
import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
} from "../../../../../../utils/common";
import { errorCodes } from "../../../../../../constants/errorKeys";
import { findUserById } from "../../../../../../utils/user";
import { connectDb } from "../../../../../../lib/dbConnect";

connectDb();

const POST = async (request) => {
  const corsHeader = await corsAndHeadersVerification(req);
  const user = await authenticateUser(req);
  const api_req = await request.json();
  try {
    const existingUser = await findUserById(user?._id);
    if (!existingUser) {
      return apiResponse(errorCodes.badRequest, "User not found");
    }
    if (api_req?.password) {
      const hashedPassword = await bcrypt.hash(api_req?.password, 12);
      existingUser.password = hashedPassword;
    }
    if (api_req?.city) existingUser.city = api_req?.city;
    if (api_req?.country) existingUser.country = api_req?.country;
    if (api_req?.companyName) existingUser.companyName = api_req?.companyName;
    if (api_req?.companyAddress)
      existingUser.companyAddress = api_req?.companyAddress;
    if (api_req?.companyCity) existingUser.companyCity = api_req?.companyCity;
    if (api_req?.companyCountry)
      existingUser.companyCountry = api_req?.companyCountry;
    if (api_req?.experience) existingUser.experience = api_req?.experience;
    if (api_req?.description) existingUser.description = api_req?.description;
    if (api_req?.phonenumber) {
      existingUser.phonenumber = phonenumber;
      existingUser.phoneOtp = await generateRandomCode();
      existingUser.phoneVerified = false;
    }
    if (api_req?.email) {
      existingUser.email = api_req?.email;
      existingUser.emailOtp = await generateRandomCode();
      existingUser.emailVerified = false;
    }

    await existingUser.save();
    existingUser = existingUser.toObject();
    console.log("newUser", existingUser);
    existingUser = await excludeKeys(existingUser, [
      "phonOtp",
      "emailOtp",
      "password",
      "refreshToken",
      "accessToken",
      "creationTime",
      "updatetime",
    ]);
    console.log("newUser", existingUser);
    return apiResponse(
      errorCodes.successResponse,
      "User updated successfully",
      existingUser
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
