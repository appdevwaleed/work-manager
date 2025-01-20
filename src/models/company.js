const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  type: {
    type: String,
    enum: [
      "store", //inside country but new
      "company", //wokring for company
      "subcompany", //on notice period but inside country
      "substore", //on notice period but inside country
    ],
    default: "company",
  },
  parentCompany: {
    type: Number, //parent company id mongoose.ObjectId
    unique: true,
    default: null,
    sparse: true, // Enables unique constraint to ignore null values
  },
  status: {
    type: String,
    enum: [
      "active",
      "inactive",
      "deleted",
      "blocked",
      "pending", //request to create company
    ],
    default: "company",
  },
});

export default mongoose.models.Company ||
  mongoose.model("Company", CompanySchema);
