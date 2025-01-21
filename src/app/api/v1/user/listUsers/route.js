const { NextResponse } = require("next/server");
import { authenticateUser, corsAndHeadersVerification } from "@/utils/common";
import { getAllUsers } from "@/utils/user";

const GET = async (req, res) => {
  try {
    const corsHeader = await corsAndHeadersVerification(req);
    const user = await authenticateUser(req);
    let user_list = await getAllUsers(req);
    console.log("user_list", user_list);

    return NextResponse.json({
      status: 200,
      message: "users found",
      data: user_list,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
};

export { GET };
