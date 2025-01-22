export const companyMainTypeEnum = ["Services", "Product"]; //services based company or product based company
export const def_companyMainType = "Product";
export const companySubTypeEnum = [
  "Store", //inside country but new
  "Company", //wokring for company
  "Subcompany", //on notice period but inside country
  "Substore", //on notice period but inside country
];
export const def_companySubType = "Company";
export const companyStatus = [
  "Active",
  "Inactive",
  "Deleted",
  "Blocked",
  "Pending", //request to create company
];
export const def_companyStatus = "Active";
export const user_com_roles = ["Admin", "Subadmin", "Manager", "Employee"];
export const def_user_com_role = "Admin";
export const user_com_status = [
  "Active",
  "In Active",
  "Deleted",
  "Blocked",
  "Pending",
];
export const def_user_com_status = "Active";
// ...................................................................Company Enums End...................................................................................................................................

export const userDeviceType = ["Phone", "System"];
export const userDeviceType_def = "Phone";

export const userJobRole = ["Superadmin", "Admin", "Manager", "User"];
export const userJobRole_def = "User";

export const userStatus = [
  "Active",
  "Inactive",
  "Blocked",
  "Deleted",
  "In Process",
  "Rejected",
];
export const userStatus_def = "Active";
// ...................................................................User Enums End.....................................................................................................................................
