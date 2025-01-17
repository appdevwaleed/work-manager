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

// import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_DB_URL;

// if (!MONGO_URI) {
//   throw new Error('Please define the MONGO_URI environment variable');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export const connectDb = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }
