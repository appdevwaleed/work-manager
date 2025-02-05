import { Company } from "../models/company";
import {
  companyMainTypeEnum,
  companySubTypeEnum,
  companyStatus,
} from "../constants/enums";
import { apiResponse, generateRandomCode } from "../utils/common";
import { includeKeys } from "../utils/common";
import { errorCodes } from "../constants/errorKeys";
import { errorMessage } from "../constants/errorMessages";

import { connectDb } from "../lib/dbConnect";
connectDb();

export const createCompany = async (request, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let api_req = await request.json();
      if (user?.jobRole !== "Superadmin" && user?.jobRole !== "Admin") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.notAuthPerson,
          _obj: ["Superadmin", "Admin"],
        });
      }
      if (!api_req?.name || api_req?.name.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noNameError,
        });
      }
      if (!api_req?.city || api_req?.city.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCityError,
        });
      }

      if (!api_req?.country || api_req?.country.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCountryError,
        });
      }
      if (!api_req?.address || api_req?.address.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noAddrError,
        });
      }

      let company = await new Company({
        name: api_req.name,
        city: api_req.city,
        country: api_req.country,
        address: api_req.address,
        status: api_req.status,
        createdby: user._id,
        updatedby: user._id,
        company_key: await generateRandomCode(),
      });
      await company.save();
      if (
        api_req?.mainType &&
        !companyMainTypeEnum.includes(api_req?.mainType)
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comTypeError,
          _obj: companyMainTypeEnum,
        });
      } else if (
        api_req?.mainType &&
        companyMainTypeEnum?.includes(api_req.mainType)
      ) {
        company.mainType = api_req.mainType;
      }

      if (api_req?.subType && !companySubTypeEnum?.includes(api_req.subType)) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comSubTypeError,
          _obj: companyMainTypeEnum,
        });
      } else if (
        api_req?.subType &&
        companySubTypeEnum.includes(api_req?.subType)
      ) {
        company.subType = api_req?.subType;
      }

      if (api_req?.status && !companyStatus.includes(api_req?.status)) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comStatusError,
          _obj: companyStatus,
        });
      } else {
        company.status = api_req.status;
      }
      console.log("company", company);
      await company.save();
      resolve(company);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};
export const updateCompany = async (request, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let api_req = await request.json();
      if (user?.jobRole !== "Superadmin" && user?.jobRole !== "Admin") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.notAuthPerson,
          _obj: ["Superadmin", "Admin"],
        });
      }
      let fil_company = await Company.findById(api_req?.company_id);
      if (!fil_company) {
        console.log("fil_company", api_req?.company_id);
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comNotFound,
          _obj: {},
        });
      }
      if (api_req?.name && api_req?.name.trim() !== "")
        fil_company.name = api_req?.name;
      if (api_req?.city && api_req?.city.trim() !== "") {
        fil_company.city = api_req?.city;
      }

      if (api_req?.country && api_req?.country.trim() !== "") {
        fil_company.country = api_req?.country;
      }
      if (api_req?.address && api_req?.address.trim() !== "") {
        fil_company.address = api_req?.address;
      }
      if (api_req?.parentCompany && api_req?.parentCompany.trim() !== "") {
        fil_company.parentCompany = api_req?.parentCompany;
      }
      if (api_req?.status && !companyStatus?.includes(api_req?.status)) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comStatusError,
          _obj: companyStatus,
        });
      } else if (api_req?.status && companyStatus?.includes(api_req?.status)) {
        fil_company.status = api_req?.status;
      }
      if (
        api_req?.mainType &&
        !companyMainTypeEnum?.includes(api_req?.mainType)
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comTypeError,
          _obj: companyMainTypeEnum,
        });
      } else if (
        api_req?.mainType &&
        companyMainTypeEnum?.includes(api_req?.mainType)
      ) {
        fil_company.mainType = api_req?.mainType;
      }
      if (api_req?.subType && !companySubTypeEnum?.includes(api_req?.subType)) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.comSubTypeError,
          _obj: companySubTypeEnum,
        });
      } else if (
        api_req?.subType &&
        companySubTypeEnum?.includes(api_req?.subType)
      ) {
        fil_company.subType = api_req?.subType;
      }
      fil_company.updatedby = user._id;
      await fil_company.save();
      resolve(fil_company);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllComapnies = async (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      let companies = await Company.find();
      if (companies?.length > 0) {
        resolve(companies);
      } else {
        reject({
          message: "companies not found",
          status: 400,
        });
      }
    } catch (error) {
      reject({
        message: "companies not found",
        status: 400,
        data: error,
      });
    }
  });
};

export const responseMessage = async (status, message, _obj) => {};
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
    "createdby",
    "creationTime",
    "updatetime",
  ]);
  return data;
};
