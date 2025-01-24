import { signUpUser, findUserByEmail, findUserByPhone } from "@/utils/user";
import { connectDb } from "@/lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
  generateRandomCode,
  excludeKeys,
  hashPassword,
} from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
import { errorMessage } from "@/constants/errorMessages";
import { userJobRole } from "@/constants/enums";

connectDb();

const POST = async (request) => {
  try {
    const api_req = await request.json();
    console.log("api_reqapi_reqapi_reqapi_reqapi_req", api_req);
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
    if (api_req?.jobRole && !userJobRole.includes(api_req?.jobRole.trim())) {
      reject({
        status: errorCodes?.badRequest,
        message: errorMessage.noJobRole,
        _obj: userJobRole,
      });
    }

    let newUser = null;
    if (api_req?.email) newUser = await signUpUser({ email: api_req?.email });
    else if (api_req?.phonenumber)
      newUser = await signUpUser({ phonenumber: api_req?.phonenumber });

    if (api_req?.password) {
      newUser.password = await hashPassword(api_req?.password);
    }

    newUser.refreshToken = await generateRefreshToken(newUser);
    newUser.accessToken = await generateAccessToken(newUser);
    if (api_req?.jobRole && userJobRole.includes(api_req?.jobRole.trim())) {
      newUser.jobRole = api_req?.jobRole;
    }
    await newUser.save();
    newUser = newUser.toObject();
    console.log("newUser", newUser);
    newUser = await excludeKeys(newUser, [
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
