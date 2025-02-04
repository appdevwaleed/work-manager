import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/dbConnect";
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
      let _user_in_userTable = null;
      let _user_company_join = null;
      let _user_company = null;

      const api_req = await request.json();
      if (
        (user?.jobRole == "Superadmin" || user?.jobRole == "Admin") &&
        !api_req?.company_id
      ) {
        reject({
          status: errorCodes?.badRequest,
          message: errorMessage.noCompanyId,
        });
      } else if (
        (user?.jobRole == "Superadmin" || user?.jobRole == "Admin") &&
        api_req?.company_id
      ) {
        _user_company = await Company.findById(api_req.company_id);
        if (!_user_company) {
          reject({
            status: errorCodes?.badRequest,
            message: errorMessage.noCompanyFound,
          });
        }
        let val_response = await validateUser(api_req);
        if (val_response !== true) reject(val_response);
        if (!api_req?.phonenumber && !api_req?.email) {
          reject({
            status: errorCodes?.badRequest,
            message: "Either phonenumber or email is required",
          });
        }

        if (api_req?.use_id)
          _user_in_userTable = await findUserByEmail(api_req?.email);
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
          });
          await _user_in_userTable.save();
        }

        _user_company_join = await UserCompany.findOne()
          .where("user")
          .equals(_user_in_userTable._id)
          .where("company")
          .equals(_user_company._id);
        console.log(_user_company_join);
        if (!_user_company_join || _user_company_join?.length == 0) {
          _user_company_join = await new UserCompany({
            user: _user_in_userTable._id,
            company: _user_company._id,
            roles: api_req.user_com_roles,
            status: api_req.user_com_status,
            createdby: user._id,
          });
          await _user_company_join.save();
        } else {
          (_user_company_join.user = _user_company_join.user),
            (_user_company_join.company = _user_company_join.company),
            (_user_company_join.roles = api_req.user_com_roles);
          _user_company_join.status = api_req.user_com_status;
          _user_company_join.updatetime = Date.now();
          console.log(_user_company_join);
          await _user_company_join.save();
        }
      } else {
        _user_company = await UserCompany.where("user")
          .equals(user._id)
          .where("roles")
          .equals(["Admin", "Subadmin"]) //Admin or Subadmin of the company can add user
          .where("status")
          .equals("Active");
        if (!_user_company) {
          reject({
            status: errorCodes?.badRequest,
            message: errorMessage.notAuthorized_user,
            _obj: ["Superadmin", "Subadmin"],
          });
        }
      }

      if (api_req?.fname) _user_in_userTable.fname = api_req.fname;
      if (api_req?.lname) _user_in_userTable.lname = api_req.lname;
      // if (api_req?.phonenumber)
      //   _user_in_userTable.phonenumber = api_req.phonenumber;
      // if (api_req?.email) _user_in_userTable.email = api_req.email;
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

      ////////////////////////////////////////////////////////////////////////////
      console.log(_user_in_userTable);
      console.log(_user_company);
      console.log(_user_company_join);
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
