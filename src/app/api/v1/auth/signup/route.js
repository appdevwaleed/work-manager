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
  generateRandomCode,
  excludeKeys,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  const api_req = await request.json();
  if (!api_req?.email || !api_req?.phonenumber) {
    return apiResponse(
      errorCodes.badRequest,
      "email or phonenumber is required"
    );
  }
  const existingUser = await findUserByPhone(api_req?.phonenumber);
  if (existingUser) {
    return apiResponse(errorCodes.badRequest, "User already exists");
  }
  try {
    let newUser = await createUser({
      fname: api_req.fname,
      lname: api_req.lname,
      email: api_req.email,
      phonenumber: api_req.phonenumber,
    });
    if (api_req?.password) {
      const hashedPassword = await bcrypt.hash(api_req?.password, 12);
      newUser.password = hashedPassword;
    }
    if (api_req?.city) newUser.city = api_req?.city;
    if (api_req?.country) newUser.country = api_req?.country;
    if (api_req?.companyName) newUser.companyName = api_req?.companyName;
    if (api_req?.companyAddress)
      newUser.companyAddress = api_req?.companyAddress;
    if (api_req?.companyCity) newUser.companyCity = api_req?.companyCity;
    if (api_req?.companyCountry)
      newUser.companyCountry = api_req?.companyCountry;
    if (api_req?.experience) newUser.experience = api_req?.experience;
    if (api_req?.description) newUser.description = api_req?.description;
    if (api_req?.profileUrl) newUser.profileUrl = api_req?.profileUrl;
    newUser.refreshToken = await generateRefreshToken(newUser);
    newUser.accessToken = await generateAccessToken(newUser);
    newUser.phoneOtp = await generateRandomCode();
    newUser.emailOtp = await generateRandomCode();

    await newUser.save();
    newUser = newUser.toObject();
    console.log("newUser", newUser);
    newUser = await excludeKeys(newUser, [
      "phonOtp",
      "emailOtp",
      "password",
      "refreshToken",
      "accessToken",
      "creationTime",
      "updatetime",
    ]);
    console.log("newUser", newUser);
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
