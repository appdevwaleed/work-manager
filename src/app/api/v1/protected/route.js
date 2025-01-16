import passport from "../../../../lib/passport";
const { NextResponse } = require("next/server");
import { authenticateUser } from "../../../../lib/middleware/auth";

passport.initialize();

const GET = async (req, res) => {
  try {
    const user = await authenticateUser(req, res);
    console.log("authenticate done .....", user);
    return NextResponse.json(user, {
      status: 200,
      message: "token checking",
    });
  } catch (error) {
    console.log("authenticate error .....", error);
    return NextResponse.json(error, {
      status: 404,
      message: "token checking",
    });
  }

  // passport.authenticate("jwt", { session: false }, (err, user, info) => {
  //   if (err) {
  //     return NextResponse.json({
  //       status: 401,
  //       message: "Unauthorized",
  //     });
  //   }

  //   if (!user) {
  //     return NextResponse.json({
  //       status: 401,
  //       message: info?.message || "Token invalid",
  //     });
  //   }

  //   // If authenticated, return the user's details or other protected data
  //   NextResponse.json({
  //     status: 200,
  //     message: "authorized",
  //   });
  // })(req, res);
};

export { GET };
