import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "work_space",
    });
    console.log("db connected ...");
  } catch (error) {
    console.log("failed to connect with db ...");
    console.log(error);
  }
};
