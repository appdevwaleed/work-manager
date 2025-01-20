import Company from "@/models/company";
import {
  companyMainTypeEnum,
  companySubTypeEnum,
  companyStatus,
} from "@/constants/enums";
import { apiResponse } from "@/utils/common";
import { includeKeys } from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
export const createCompany = async (request) => {
  try {
    console.log("createCompany..........");
    let api_req = await request.json();
    if (!api_req?.name || api_req?.name.trim() == "")
      return apiResponse(errorCodes?.badRequest, "Please provide name");
    if (!api_req?.city || api_req?.city.trim() == "")
      return apiResponse(errorCodes?.badRequest, "Please provide city");
    if (!api_req?.country || api_req?.country.trim() == "")
      return apiResponse(errorCodes?.badRequest, "Please provide country");
    if (!api_req?.address || api_req?.address.trim() == "")
      return apiResponse(
        errorCodes?.badRequest,
        "Please provide company address"
      );
    if (user?.jobRole !== "superadmin" && user?.jobRole !== "admin") {
      return apiResponse(
        errorCodes?.badRequest,
        "Not an authentic person to create companies, You should be an admin or superadmin"
      );
    }
    let company = new Company({
      name: api_req.name,
      city: api_req.city,
      country: api_req.country,
      address: api_req.address,
      type: api_req.type,
      parentCompany: api_req.parentCompany,
      status: api_req.status,
    });
    if (api_req?.mainType && !companyMainTypeEnum.includes(api_req?.mainType)) {
      return apiResponse(
        errorCodes.badRequest,
        "Company type should be appropiate",
        companyMainTypeEnum
      );
    } else if (
      api_req?.mainType &&
      companyMainTypeEnum?.includes(api_req.mainType)
    ) {
      company.mainType = api_req.mainType;
    }

    if (api_req?.subType && !companySubTypeEnum?.includes(api_req.subType)) {
      return apiResponse(
        errorCodes.badRequest,
        "Company subType should be appropiate",
        companySubTypeEnum
      );
    } else if (
      api_req?.subType &&
      companySubTypeEnum.includes(api_req?.subType)
    ) {
      company.subType = api_req?.subType;
    }

    if (api_req?.status && !companyStatus.includes(api_req?.status)) {
      return apiResponse(
        errorCodes?.badRequest,
        "Company status should be appropiate",
        companyStatus
      );
    } else {
      company.status = api_req.status;
    }
    console.log("company11111112222................");
    await company.save();
    return company;
  } catch (error) {
    console.log("error 1");
    return error;
  }
};
export const responseData = async (companyData) => {
  let data = await includeKeys(companyData, [
    "_id",
    "name",
    "city",
    "country",
    "address",
    "mainType",
    "subType",
    "parentCompany",
    "status",
  ]);
  return data;
};
