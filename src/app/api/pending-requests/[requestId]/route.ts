import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  await connectDb();

  try {
    const { requestId } = params;

    // Validate if the requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request ID",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch the review by its ID
    const review = await Review.findById(requestId);

    // Check if the review exists
    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    // Fetch the associated product using productId stored in review
    const product = await Product.findById(review.productId);

    // Check if the product exists
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Associated Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // Return the found review and associated product
    return NextResponse.json(
      {
        success: true,
        data: {
          review,
          product,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/pending-requests/[requestId] :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching the Review and Product",
      },
      {
        status: 500,
      }
    );
  }
}
