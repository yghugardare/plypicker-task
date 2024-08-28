import connectDb from "@/lib/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
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

    // Delete the product by its ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
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

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("api/delete-product/[productId]/route.ts :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while deleting the Product",
      },
      {
        status: 500,
      }
    );
  }
}
