import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../../../../../lib/user";
import { NextResponse } from "next/server";

const POST = async (request) => {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(error.message, {
      status: 400,
      message: "Please provide both email and password",
    });
  }

  try {
    // Find user by email
    let user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(error.message, {
        status: 500,
        message: "Invalid email address",
      });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(error.message, {
        status: 500,
        message: "Invalid password",
      });
    }

    // Create new Access and Refresh Tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save the refresh token in user's record (optional)
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    user = user.toObject();
    return NextResponse.json(
      {
        ...user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      {
        status: 200,
        message: "Authenticated successfully",
      }
    );
  } catch (error) {
    return NextResponse.json(error.message, {
      status: 500,
      message: "Server error",
    });
  }
};
export { POST };
