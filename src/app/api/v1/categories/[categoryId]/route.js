import { Category } from "@/models/category";
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../lib/dbConnect";
connectDb();
const PUT = async (request, { params }) => {
  const { categoryId } = await params;
  console.log("category", categoryId);
  try {
    const { title, parentId, leftCatId, status, coordinates, radius } =
      await request.json();
    let category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({
        status: 404,
        message: "Category not found",
      });
    }
    console.log("category", category);
    if (!!title) category.title = title;

    if (!!status) category.status = status;
    if (parentId !== undefined) category.parentId = parentId; // if (!!leftCatId) category.leftCatId = leftCatId;
    if (leftCatId !== undefined) category.leftCatId = leftCatId;

    if (!!coordinates) {
      category.coordinates = coordinates;
      category.byRadius = false;
      category.radius = 0;
    } else if (!!radius && radius > 0) {
      category.coordinates = [];
      category.byRadius = true;
      category.radius = radius;
    }

    const updatedCategory = await category.save();
    return NextResponse.json(updatedCategory, {
      status: 201,
      message: "Category Updated successfully",
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error, {
      status: 404,
      message: "Category not found",
    });
  }
};

export { PUT };
