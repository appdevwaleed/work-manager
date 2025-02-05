import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
  hashPassword,
  authUsrWithoutActiveCheck,
} from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
import { createUpdateUser } from "@/utils/user";
import { connectDb } from "@/lib/dbConnect";
import { errorMessage } from "@/constants/errorMessages";

connectDb();
// Any super admin can create & update user for a specific company
const POST = async (request) => {
  try {
    await corsAndHeadersVerification(request);
    let user = await authenticateUser(request);
    const response = await createUpdateUser(request, user);
    return apiResponse(
      errorCodes.createdSuccess,
      errorMessage.userCreated,
      response
    );
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      error.status ? error.status : errorCodes?.methodNotAllowed,
      error.message
        ? error.message
        : "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
