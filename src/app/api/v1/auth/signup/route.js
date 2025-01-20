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
  hashPassword,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

connectDb();

const POST = async (request) => {
  try {
    const api_req = await request.json();
    if (!api_req?.email && !api_req?.phonenumber) {
      return apiResponse(
        errorCodes.badRequest,
        "email or phonenumber is required"
      );
    }
    let existingUser = null;
    if (api_req?.phonenumber)
      existingUser = await findUserByPhone(api_req?.phonenumber);
    else if (api_req?.email)
      existingUser = await findUserByEmail(api_req?.email);

    if (existingUser) {
      let message = api_req?.phonenumber
        ? "User already exists, please signin with " + api_req.phonenumber
        : "User already exists, please signin with " + api_req.email;
      return apiResponse(errorCodes.badRequest, message);
    }

    let newUser = null;
    if (api_req?.email) {
      newUser = await createUser({ email: api_req?.email });
      newUser.emailOtp = await generateRandomCode();
    } else if (api_req?.phonenumber) {
      newUser = await createUser({ phonenumber: api_req?.phonenumber });
    }
    if (api_req?.password) {
      newUser.password = await hashPassword(api_req?.password);
      newUser.phoneOtp = await generateRandomCode();
    }
    await newUser.save();
    newUser = newUser.toObject();
    newUser = await excludeKeys(newUser, [
      "phoneOtp",
      "emailOtp",
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
