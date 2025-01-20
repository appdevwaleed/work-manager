import mongoose, { Schema } from "mongoose";
const userCompanySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    roles: [
      {
        type: String,
        enum: ["admin", "manager", "employee"],
        default: "employee",
      },
    ],
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "deleted",
        "blocked",
        "pending", //request to create company
      ],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    indexes: [
      // Ensure a user can only have one unique relationship with a specific company
      { unique: true, fields: ["user", "company"] },
    ],
  }
);

export default mongoose.models.UserCompany ||
  mongoose.model("UserCompany", userCompanySchema);
