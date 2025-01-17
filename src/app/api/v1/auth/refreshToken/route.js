import { generateToken } from "../../../../../utils/user"; // Your user model functions
import { apiResponse } from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

const POST = async (request) => {
  try {
    const { refreshToken } = await request.json();
    if (refreshToken == null || refreshToken == undefined) {
      return apiResponse(errorCodes.badRequest, "Refresh token is required");
    }
    const response = await generateToken(refreshToken);
    return apiResponse(
      errorCodes.successResponse,
      "updaten token successfully",
      response
    );
  } catch (error) {
    console.log("error", error);
    return apiResponse(errorCodes.badRequest, error?.message, error);
  }
};
export { POST };
