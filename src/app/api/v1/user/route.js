import { connectDb } from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "../../../../models/user";
connectDb();
// export function GET(request) {
//   return NextResponse.json(users);
// }
export async function POST(request) {
  //fetch user information from request
  const { fname, lname, email, phonenumber, password } = await request.json();
  const user = new User({
    fname,
    lname,
    email,
    phonenumber,
    password,
  });
  try {
    const createdUser = await user.save();
    const response = NextResponse.json(user, {
      status: 201,
      message: "User created successfully",
    });
    return response;
  } catch (error) {
    return NextResponse.json(error, {
      status: 404,
      message: "Error got in user creation",
    });
  }
}
export function PUT() {}
export function DELETE() {}
