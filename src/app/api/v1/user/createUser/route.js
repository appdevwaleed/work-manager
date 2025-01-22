import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
  hashPassword,
} from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
import { createUser } from "@/utils/user";
import { connectDb } from "@/lib/dbConnect";
import { errorMessage } from "@/constants/errorMessages";

connectDb();

const POST = async (request) => {
  try {
    await corsAndHeadersVerification(request);
    let user = await authenticateUser(request);
    const response = await createUser(request, user);
    apiResponse(errorCodes.createdSuccess, errorMessage.userCreated, response);
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
