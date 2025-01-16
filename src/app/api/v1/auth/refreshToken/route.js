import jwt from "jsonwebtoken";
import { findUserById } from "../../../../../lib/user"; // Your user model functions
import { NextResponse } from "next/server";
const POST = async (request) => {
  let _request = await request.json();

  const { refreshToken } = _request;
  console.log("refreshToken", refreshToken);
  if (refreshToken == null || refreshToken == undefined) {
    return NextResponse.json({
      status: 400,
      message: "Refresh token is required",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    let user = await findUserById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(error.message, {
        status: 401,
        message: "Invalid refresh token",
      });
    }
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return NextResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      },
      {
        status: 400,
        message: "Refresh token is required",
      }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
};
export { POST };
