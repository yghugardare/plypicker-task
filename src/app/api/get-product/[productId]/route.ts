import connectDb from "@/lib/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  await connectDb();

  try {
    const { productId } = params;

    // Validate if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // Return the found product
    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/get-product/[productId]/route.ts :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching the Product",
      },
      {
        status: 500,
      }
    );
  }
}
