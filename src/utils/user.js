import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/dbConnect";
import mongoose from "mongoose";

import {
  generateAccessToken,
  generateRefreshToken,
  apiResponse,
  hashPassword,
  isSubset,
} from "@/utils/common";
import { errorCodes } from "@/constants/errorKeys";
import { errorMessage } from "@/constants/errorMessages";
import {
  userDeviceType,
  userJobRole,
  userStatus,
  user_com_roles,
  user_com_status,
} from "@/constants/enums";
import { Company } from "@/models/company";
import { UserCompany } from "@/models/userCompany";
import { User } from "@/models/user";

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
      if (user.status !== "Active") {
        return apiResponse(
          errorCodes.badRequest,
          "User not active yet please try agin later"
        );
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

//Superadmin & Admin can get all users
//Only Admin or Subadmin of company can get users list of their company just

export const getAllUsers = async (request, user) => {
  return new Promise(async (resolve, reject) => {
    let check = false;
    const { company_id, user_status_in_company, roles_in_company } =
      await req.query;
    try {
      if (user?.jobRole == "Superadmin" || user.jobRole == "Admin") {
        check = true;
      } else if (
        user?.jobRole !== "Superadmin" &&
        user.jobRole !== "Admin" &&
        !company_id
      ) {
        return reject({
          status: errorCodes?.badRequest,
          message: "company_id is required to user users for your company",
        });
      } else if (
        user?.jobRole !== "Superadmin" &&
        user.jobRole !== "Admin" &&
        company_id
      ) {
        if (!mongoose.isValidObjectId(company_id)) {
          return reject({
            status: errorCodes?.badRequest,
            message: errorMessage.noCompanyFound,
          });
        } else {
          let is_company_admin = await UserCompany.findOne({
            user: user._id,
            company: new mongoose.ObjectId(company_id),
            roles: {
              $in: [user_com_roles[0], user_com_roles[1], , user_com_roles[2]],
            }, // Admin & Subadmin, Manager
            status: "Active",
          });
          if (!is_company_admin) {
            return reject({
              status: errorCodes?.badRequest,
              message: errorMessage.notAuthorized_user,
            });
          } else {
            check = true;
          }
        }
      }

      if (check) {
        let _users = null;
        if (!company_id) {
          //for super admin
          _users = await User.find();
        } else {
          //for admin subadmin and manager of the company
          let query = {};
          if (company_id) query.company = new mongoose.ObjectId(company_id);
          if (user_status_in_company) query.status = user_status_in_company;
          if (roles_in_company) {
            query.roles = { $in: roles_in_company };
          }
          _users = await UserCompany.find(query);
        }
        if (_users?.length > 0) {
          resolve({
            message: "Users Found",
            data: _users,
            status: 200,
          });
        } else {
          resolve({
            message: "Users not found",
            data: [],
            status: 200,
          });
        }
      } else {
        return reject({
          status: errorCodes?.badRequest,
          message: errorMessage.internalIssue,
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

//this function works for creation and updation of users by Superadmin & Admin
//this function alse works for creation of users and updation of users by Admin & Subadmin of company
export const createUpdateUser = async (request, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(user);
      let _user_in_userTable = null;
      let _user_company_join = null;
      let _user_company = null;

      let check = true;
      const api_req = await request.json();
      if (!mongoose.isValidObjectId(api_req.company_id)) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCompanyFound,
        });
      }
      if (
        (user?.jobRole == "Superadmin" || user?.jobRole == "Admin") &&
        !api_req?.company_id
      ) {
        check = false;
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCompanyId,
        });
      } else if (
        (user?.jobRole == "Superadmin" || user?.jobRole == "Admin") &&
        api_req?.company_id
      ) {
        check = true;
      } else {
        let adminVerification = await UserCompany.findOne({
          user: user._id,
          company: api_req.company_id,
          roles: { $in: ["Admin", "Subadmin"] }, // Using `$in` operator
          status: "Active",
        });
        if (!adminVerification) {
          check = false;
        }
      }

      if (!check) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.notAuthorized_user,
        });
      }

      _user_company = await Company.findById(api_req.company_id);
      if (!_user_company) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCompanyFound,
        });
      }

      let val_response = await validateUser(api_req);
      if (val_response !== true) reject(val_response);

      if (api_req?.user_id)
        _user_in_userTable = await findUserById(api_req?.user_id);
      else if (api_req?.phonenumber)
        _user_in_userTable = await findUserByPhone(api_req?.phonenumber);
      else if (api_req?.email)
        _user_in_userTable = await findUserByEmail(api_req?.email);

      if (!_user_in_userTable) {
        _user_in_userTable = await new User({
          fname: api_req.fname,
          lname: api_req.lname,
          email: api_req.email,
          phonenumber: api_req.phonenumber,
          password: await hashPassword("A12345678"), //default password set for all users created by admins
          createdby: user._id,
          updatedBy: user._id,
        });
        await _user_in_userTable.save();
      }
      _user_company_join = await UserCompany.findOne()
        .where("user")
        .equals(_user_in_userTable._id)
        .where("company")
        .equals(_user_company._id);
      if (!_user_company_join || _user_company_join?.length == 0) {
        _user_company_join = await new UserCompany({
          user: _user_in_userTable._id,
          company: _user_company._id,
          roles: api_req.user_com_roles,
          status: api_req.user_com_status,
          createdby: user._id,
          updatedBy: user._id,
        });
        await _user_company_join.save();
      } else {
        (_user_company_join.user = _user_company_join.user),
          (_user_company_join.company = _user_company_join.company),
          (_user_company_join.roles = api_req.user_com_roles);
        _user_company_join.status = api_req.user_com_status;
        _user_company_join.updatetime = Date.now();
        _user_company_join.updatedBy = user._id;
        await _user_company_join.save();
      }

      if (api_req?.fname) _user_in_userTable.fname = api_req.fname;
      if (api_req?.lname) _user_in_userTable.lname = api_req.lname;
      if (api_req?.deviceType)
        _user_in_userTable.deviceType = api_req.deviceType;
      if (api_req?.jobRole) _user_in_userTable.jobRole = api_req.jobRole;
      if (api_req?.userStatus)
        _user_in_userTable.userStatus = api_req.userStatus;
      if (api_req?.city && api_req?.city !== "")
        _user_in_userTable.city = api_req.city;
      if (api_req?.country && api_req?.country !== "")
        _user_in_userTable.country = api_req.country;
      if (api_req?.profileUrl && api_req?.profileUrl !== "")
        _user_in_userTable.profileUrl = api_req.profileUrl;
      if (api_req?.deviceId && api_req?.deviceId !== "")
        _user_in_userTable.deviceId = api_req.deviceId;
      _user_in_userTable.updatedBy = user._id;
      _user_in_userTable.updatetime = new Date();

      await _user_in_userTable.save();
      _user_in_userTable = _user_in_userTable.toObject();
      _user_company_join = _user_company_join.toObject();
      _user_company = _user_company.toObject();
      let response = {
        ..._user_in_userTable,
        company: { ..._user_company, useInCompany: _user_company_join },
      };
      resolve(response);
    } catch (error) {
      console.log("error company_sel", error);
      reject(error);
    }
  });
};

const validateUser = async (api_req) => {
  if (!api_req?.fname || api_req?.fname.trim() == "") {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noFNameError,
    };
  } else if (!api_req?.lname || api_req?.lname.trim() == "") {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noLNameError,
    };
  } else if (!api_req?.phonenumber && !api_req?.email && api_req?.user_id) {
    reject({
      status: errorCodes?.badRequest,
      message: "Either phonenumber or email or user_id is required",
    });
  } else if (
    api_req?.deviceType &&
    !userDeviceType.includes(api_req?.deviceType.trim())
  ) {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noDeviceType,
      _obj: userDeviceType,
    };
  } else if (
    api_req?.jobRole &&
    !userJobRole.includes(api_req?.jobRole.trim())
  ) {
    //user role as generic mostly it will be User as default
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noJobRole,
      _obj: userJobRole,
    };
  } else if (
    api_req?.userStatus &&
    !userStatus.includes(api_req?.userStatus.trim()) //user status as generic mostly it will be Active as default
  ) {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noUserStatus,
      _obj: userStatus,
    };
  } else if (!api_req?.email || api_req?.email.trim() == "") {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noEmailError,
    };
  } else if (!api_req?.phonenumber || api_req?.phonenumber.trim() == "") {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noPhoneError,
    };
  }
  //role of user you want in the company
  if (
    !api_req?.user_com_roles ||
    !isSubset(api_req?.user_com_roles, user_com_roles)
  ) {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noUsrComRoles,
      _obj: user_com_roles,
    };
  }
  if (
    !api_req?.user_com_status ||
    !user_com_status.includes(api_req?.user_com_status.trim())
  ) {
    return {
      status: errorCodes?.badRequest,
      message: errorMessage.noUsrComStatus,
      _obj: user_com_status,
    };
  } else return true;
};
