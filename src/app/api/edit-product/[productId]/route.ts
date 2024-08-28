import connectDb from "@/lib/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
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

    const body = await request.json();
    const {
      productName,
      price,
      description,
      productFirebaseImageLink,
      productBase64ImageUrl,
      imgType
    } = body;

    // Validate the inputtt
    if (
      !productName ||
      !price ||
      !description ||
      !productFirebaseImageLink ||
      !productBase64ImageUrl ||
      !imgType
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName,
        price,
        description,
        productFirebaseImageLink,
        productBase64ImageUrl,
      },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures validation on update
    );

    if (!updatedProduct) {
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
        data: updatedProduct,
        message: "Product updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/edit-product/[productId]/route.ts :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while updating the Product",
      },
      {
        status: 500,
      }
    );
  }
}
