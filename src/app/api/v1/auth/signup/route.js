// /pages/api/auth/signup.js
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "../../../../../lib/user";
import { connectDb } from "../../../../../lib/dbConnect";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../../lib/common";

connectDb();

const POST = async (request) => {
  const { fname, lname, email, phonenumber, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({
      status: 400,
      message: "Email and password are required",
    });
  }
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return NextResponse.json({
      status: 400,
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    let newUser = await createUser({
      fname,
      lname,
      email,
      phonenumber,
      password: hashedPassword,
    });
    // await newUser.save();
    console.log("newUser", newUser);
    const accessToken = await generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;
    await newUser.save();
    newUser = newUser.toObject();
    return NextResponse.json(newUser, {
      status: 200,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error, {
      status: 405,
      message: "Method not allowed",
    });
  }
};
export { POST };
