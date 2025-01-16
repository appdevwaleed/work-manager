const { Category } = require("@/models/category");
const { NextResponse } = require("next/server");
import { connectDb } from "../../../../lib/dbConnect";
import { buildTree } from "../../../../lib/categories/categories";
import { generateRandomId } from "../../../../lib/common";
import { authenticateUser } from "../../../../lib/middleware/auth";

connectDb();

const GET = async (req, res) => {
  try {
    const user = await authenticateUser(req, res);
    console.log("authenticate done .....", user);
    const query = {};
    query.status = "active";
    let categories = await Category.find(query).lean();

    for (let i = 0; i < categories?.length; i++) {
      if (
        categories[i].leftCatId !== null &&
        categories[i].leftCatId !== undefined
      ) {
        let indexItem = categories?.findIndex(
          (innerItem) => categories[i].leftCatId == innerItem.randomId
        );
        if (indexItem !== -1) {
          let catItem = categories[i];
          categories.splice(i, 1); //delete item before and add item later
          indexItem = categories?.findIndex(
            (innerItem) => catItem.leftCatId == innerItem.randomId
          );
          categories.splice(indexItem + 1, 0, catItem);
        }
      }
    }
    console.log("categories", categories);
    const treeData = buildTree(categories);
    return NextResponse.json(treeData, {
      status: 200,
      message: "List of categories",
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error, {
      status: 404,
      message: "Unable to get categories",
    });
  }
};

const POST = async (request) => {
  const { title, parentId, leftCatId, radius, status, coordinates } =
    await request.json();
  try {
    let categoryObj = null;
    if (!!coordinates == false && (!!radius == false || radius === 0)) {
      //!!coordinates here means (coordinates==null||coordinates==undefined)
      return NextResponse.json({
        status: 405,
        message:
          "Please provide coordinates or 'radius' and if providing 'radius' then it must be more the 0  ",
      });
    }
    if (!!coordinates) {
      categoryObj = new Category({
        title,
        parentId,
        leftCatId,
        radius: 0,
        byRadius: false,
        status,
        coordinates,
        randomId: generateRandomId(),
      });
    }
    if (!!radius && radius >= 0) {
      categoryObj = new Category({
        title,
        parentId,
        leftCatId,
        radius: radius,
        byRadius: true,
        status,
        coordinates: [],
        randomId: generateRandomId(),
      });
    }

    await categoryObj.save();
    return NextResponse.json(categoryObj, {
      status: 200,
      message: "Category created successfully",
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 404,
      message: "table not found",
    });
  }
};
export { GET, POST };
