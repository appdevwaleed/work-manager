import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
  hashPassword,
} from "@/utils/common";
import { errorCodes } from "../constants/errorKeys";
import { errorMessage } from "../constants/errorMessages";
import {
  userDeviceType,
  userJobRole,
  userStatus,
  user_com_roles,
} from "../constants/enums";
import { Company } from "../models/company";
import { UserCompany } from "../models/userCompany";
import { User } from "../models/user";

connectDb();

// Function to find a user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Function to find a user by email
export const findUserByPhone = async (phonenumber) => {
  return await User.findOne({ phonenumber });
};

// Function to find a user by ID
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Function to create a new user when user signup himself with all default settings
export const signUpUser = async ({ fname, lname, email, phonenumber }) => {
  const user = new User({
    fname,
    lname,
    email,
    phonenumber,
  });
  await user.save();
  return user;
};

// Function to check if password is correct
export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      let user = await findUserById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        resolve({
          status: errorCodes.badRequest,
          message: "refresh token is not valid",
        });
      }
      const accessToken = await generateAccessToken(user);
      user.accessToken = accessToken;
      user.save();
      resolve({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

export const getAllUsers = async (request) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.find();
      if (users?.length > 0) {
        resolve(users);
      } else {
        reject({
          message: "users not found",
          status: 400,
          data: {},
        });
      }
    } catch (error) {
      reject({
        message: "users not found",
        status: 400,
        data: error,
      });
    }
  });
};

export const createUser = async (request, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let api_req = await request.json();
      let company_sel = null;
      let creating_user_company = await UserCompany.where("user")
        .equals(user._id)
        .where("roles")
        .equals(["Admin"]); // Exact match for city;
      if (
        user?.jobRole !== "Superadmin" &&
        user?.jobRole !== "Admin" &&
        !creating_user_company
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.notAuthorized_user,
          _obj: ["Superadmin", "Admin"],
        });
      }
      if (!api_req?.company_id || api_req?.company_id.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCompanyId,
        });
      } else if (api_req?.company_id && api_req?.company_id.trim() !== "") {
        company_sel = await Company.findById(api_req.company_id);

        if (!company_sel)
          reject({
            status: errorCodes?.badRequest,
            message: errorMessage.noCompanyFound,
          });
      }

      if (!api_req?.fname || api_req?.fname.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noFNameError,
        });
      }
      if (!api_req?.lname || api_req?.lname.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noLNameError,
        });
      }

      if (!api_req?.email || api_req?.email.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noEmailError,
        });
      }
      if (!api_req?.phonenumber || api_req?.phonenumber.trim() == "") {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noPhoneError,
        });
      }
      if (
        api_req?.deviceType &&
        !userDeviceType.includes(api_req?.deviceType.trim())
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noDeviceType,
          _obj: userDeviceType,
        });
      }
      if (api_req?.jobRole && !userJobRole.includes(api_req?.jobRole.trim())) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noJobRole,
          _obj: userJobRole,
        });
      }

      if (
        api_req?.userStatus &&
        !userStatus.includes(api_req?.userStatus.trim())
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noUserStatus,
          _obj: userStatus,
        });
      }
      //role of user you want in the company
      if (
        !api_req?.user_com_roles ||
        !user_com_roles.includes(api_req?.user_com_roles.trim())
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noUsrComRoles,
          _obj: user_com_roles,
        });
      }

      //new user created by super admin user
      let user_created = await new User({
        fname: api_req.fname,
        lname: api_req.lname,
        email: api_req.email,
        phonenumber: api_req.phonenumber,
        password: await hashPassword("A12345678"), //default password set for all users created by admins
        createdby: user._id,
      });
      if (api_req?.deviceType) user_created.deviceType = api_req.deviceType;
      if (api_req?.jobRole) user_created.jobRole = api_req.jobRole;
      if (api_req?.userStatus) user_created.userStatus = api_req.userStatus;
      if (api_req?.city && api_req?.city !== "")
        user_created.city = api_req.city;
      if (api_req?.country && api_req?.country !== "")
        user_created.country = api_req.country;
      if (api_req?.profileUrl && api_req?.profileUrl !== "")
        user_created.profileUrl = api_req.profileUrl;
      if (api_req?.deviceId && api_req?.deviceId !== "")
        user_created.deviceId = api_req.deviceId;
      let user_company = await new UserCompany({
        user: user_created._id,
        company: company_sel._id,
        roles: api_req.user_com_roles,
        createdby: user._id,
      });

      await user_created.save();
      await user_company.save();
      user_company = user_company.toObject();
      user_created = user_created.toObject();
      let response = {
        ...user_created,
        company: user_company,
      };
      resolve(response);
    } catch (error) {
      console.log("error company_sel", error);
      reject(error);
    }
  });
};
