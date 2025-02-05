const { NextResponse } = require("next/server");
import {
  authenticateUser,
  apiResponse,
  generateRandomCode,
  excludeKeys,
  corsAndHeadersVerification,
  hashPassword,
} from "@/utils/common";
import { getAllUsers } from "@/utils/user";

import { errorCodes } from "@/constants/errorKeys";

import { findUserById } from "@/utils/user";
import { connectDb } from "@/lib/dbConnect";

connectDb();

const GET = async (req, res) => {
  try {
    await corsAndHeadersVerification(req);
    const user = await authenticateUser(req);
    let user_list = await getAllUsers(req);
    return user_list;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
};

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
export { POST, GET };
