import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
  hashPassword,
  authUsrWithoutActiveCheck,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

import { findUserById } from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import { userJobRole } from "@/constants/enums";
import { errorMessage } from "@/constants/errorMessages";
import { UserCompany } from "@/models/userCompany";
connectDb();

const POST = async (request) => {
  try {
    const corsHeader = await corsAndHeadersVerification(request);
    let user = await authenticateUser(request);
    let existingUser = await findUserById(user?._id);

    if (api_req?.password) {
      existingUser.password = await hashPassword(api_req?.password); //
    }
    if (api_req?.city) existingUser.city = api_req?.city;
    if (api_req?.country) existingUser.country = api_req?.country;
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

    // console.log("newUser", existingUser);
    // existingUser = await excludeKeys(existingUser, [
    //   "password",
    //   "refreshToken",
    //   "accessToken",
    //   "creationTime",
    //   "updatetime",
    //   "jobRole",
    // ]);
    // return apiResponse(
    //   errorCodes.successResponse,
    //   "User updated successfully",
    //   existingUser
    // );
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      error?.status ? error.status : errorCodes?.methodNotAllowed,
      error?.message
        ? error.message
        : "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
