import { connectDb } from "@/lib/dbConnect";
import { apiResponse, excludeKeys } from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
import {
  authenticateUser,
  corsAndHeadersVerification,
} from "../../../../utils/common";
import { createCompany, responseData } from "@/utils/company";
connectDb();

const POST = async (request) => {
  try {
    const corsHeader = await corsAndHeadersVerification(request);
    const user = await authenticateUser(request);
    let company = await createCompany(request);
    console.log("company111111", company);
    company = company.toObject();
    const response = await responseData(company);
    return apiResponse(
      errorCodes.successResponse,
      "Company created successfully",
      response
    );
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      error.status ? error.status : errorCodes.methodNotAllowed,
      error.message
        ? error.message
        : "Provided data is incomplete or not accurate"
    );
  }
};
export { POST };
