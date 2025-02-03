import {
  apiResponse,
  generateRandomCode,
  excludeKeys,
  authenticateUser,
  corsAndHeadersVerification,
  hashPassword,
  authUsrWithoutActiveCheck,
} from "../../../../../utils/common";
import { errorCodes } from "../../../../../constants/errorKeys";

import { findUserById } from "../../../../../utils/user";
import { connectDb } from "../../../../../lib/dbConnect";
import { userJobRole } from "@/constants/enums";
import { errorMessage } from "@/constants/errorMessages";
import { UserCompany } from "@/models/userCompany";
connectDb();

// if token is of superadmin or admin then no need for userid as they may be updating their profile
// if user is super admin or admin and still user id is coming means they are profile for some other person
// if user is not super admin then no need for user id as they are updating for them selves
// if user is admin or manager of a company then he can only update his profile and user belongs to that company

const POST = async (request) => {
  try {
    const corsHeader = await corsAndHeadersVerification(request);
    let user = await authUsrWithoutActiveCheck(request);
    const api_req = await request.json();
    let existingUser = null;
    if (
      (user?.jobRole == "Superadmin" || user?.jobRole == "Admin") &&
      api_req.user_id
    ) {
      if (api_req.user_id) {
        existingUser = await findUserById(api_req.user_id);
      } else {
        existingUser = await findUserById(user?._id);
      }
      checkSup_A = true;
      existingUser.jobRole = api_req?.jobRole; //["Superadmin", "Admin", "Manager", "User"]
      existingUser.userStatus = api_req?.userStatus; //["Active","Inactive","Blocked","Deleted","In Process","Rejected"]
      await existingUser.save();
      existingUser = existingUser.toObject();
    } else if (api_req.company_id) {
      user = await authenticateUser(request); //Any other person then Super Admin should be an active User
      let com_admin = await UserCompany.where("user")
        .equals(user._id)
        .where("company")
        .equals(api_req.company_id)
        .where("roles")
        .equals(["Admin", "Subadmin"]);
      if (!com_admin) {
        return apiResponse(
          errorCodes.badRequest,
          errorMessage.noJobRole, //not allowed to update user as you are not Admin or SubAdmin of this company
          userJobRole
        );
      } else {
        // if(!api_req.user_id){
        //   user = await authenticateUser(request);
        //   existingUser = await findUserById(user?._id);

        // }
        let com_user = await UserCompany.where("user")
          .equals(api_req.user_id)
          .where("company")
          .equals(api_req.company_id);
        if (!com_user) {
          return apiResponse(
            errorCodes.badRequest,
            errorMessage.noJobRole, //User does not belongs to your company
            userJobRole
          );
        }
        checkCom_A = true;
        if (api_req.companyRoles) {
          com_user.roles = api_req?.companyRoles;
        }
        if (api_req.companyStatus) {
          com_user.status = api_req?.companyStatus;
        }

        existingUser = await findUserById(api_req.user_id);
        await com_user.save();
        com_user = com_user.toObject();
        existingUser = existingUser.toObject();
        existingUser = {
          ...existingUser,
          company: com_user,
        };
      }
    }
    if (!existingUser) {
      return apiResponse(errorCodes.badRequest, "User not found");
    }
    return apiResponse(
      errorCodes.createdSuccess,
      errorMessage.userCreated,
      existingUser
    );

    // if (api_req?.password) {
    //   existingUser.password = await hashPassword(api_req?.password); //
    // }
    // if (api_req?.city) existingUser.city = api_req?.city;
    // if (api_req?.country) existingUser.country = api_req?.country;
    // if (api_req?.companyName) existingUser.companyName = api_req?.companyName;
    // if (api_req?.companyAddress)
    //   existingUser.companyAddress = api_req?.companyAddress;
    // if (api_req?.companyCity) existingUser.companyCity = api_req?.companyCity;
    // if (api_req?.companyCountry)
    //   existingUser.companyCountry = api_req?.companyCountry;
    // if (api_req?.experience) existingUser.experience = api_req?.experience;
    // if (api_req?.description) existingUser.description = api_req?.description;

    // if (api_req?.phonenumber) {
    //   existingUser.phonenumber = phonenumber;
    //   existingUser.phoneOtp = await generateRandomCode();
    //   existingUser.phoneVerified = false;
    // }
    // if (api_req?.email) {

    //   existingUser.email = api_req?.email;
    //   existingUser.emailOtp = await generateRandomCode();
    //   existingUser.emailVerified = false;
    // }

    // console.log("newUser", existingUser);
    // existingUser = await excludeKeys(existingUser, [
    //   "password",
    //   "refreshToken",
    //   "accessToken",
    //   "creationTime",
    //   "updatetime",
    //   "jobRole",
    // ]);
    // return apiResponse(
    //   errorCodes.successResponse,
    //   "User updated successfully",
    //   existingUser
    // );
  } catch (error) {
    console.log("error", error);
    return apiResponse(
      error?.status ? error.status : errorCodes?.methodNotAllowed,
      error?.message
        ? error.message
        : "Provided data is incomplete or not accurate",
      error
    );
  }
};
export { POST };
