import { connectDb } from "@/lib/dbConnect";
import {
  apiResponse,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
} from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";

import { updateCompany, responseData } from "@/utils/company";
import { errorMessage } from "@/constants/errorMessages";
connectDb();

const POST = async (request) => {
  try {
    const corsHeader = await corsAndHeadersVerification(request);
    const user = await authenticateUser(request);
    let company = await updateCompany(request, user);
    company = company.toObject();
    const response = await responseData(company);
    return apiResponse(
      errorCodes.successResponse,
      errorMessage.comUpdatedSuccess,
      response
    );
  } catch (error) {
    return apiResponse(
      error.status ? error.status : errorCodes.methodNotAllowed,
      error.message
        ? error.message
        : "Provided data is incomplete or not accurate",
      error?._obj ? error._obj : error
    );
  }
};
export { POST };
