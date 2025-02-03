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
import { createUser } from "@/utils/user";
import { connectDb } from "@/lib/dbConnect";
import { errorMessage } from "@/constants/errorMessages";

connectDb();
// Any super admin or admin can create company
// If any admin or manager of company wants to create user for his company he can do also
const POST = async (request) => {
  try {
    await corsAndHeadersVerification(request);
    let user = await authenticateUser(request);
    const response = await createUser(request, user);
    console.log("error1111", response);
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
