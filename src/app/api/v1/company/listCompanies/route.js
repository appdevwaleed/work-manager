const { NextResponse } = require("next/server");
import { authenticateUser, corsAndHeadersVerification } from "@/utils/common";
import { getAllComapnies } from "@/utils/company";

const GET = async (req, res) => {
  try {
    const corsHeader = await corsAndHeadersVerification(req);
    const user = await authenticateUser(req);
    let company_list = await getAllComapnies(req);
    return NextResponse.json({
      status: 200,
      message: "companies found",
      data: company_list,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
};

export { GET };
