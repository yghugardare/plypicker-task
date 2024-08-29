import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  await connectDb();

  try {
    const { reviewId } = params;
    // we will send email of the admin in the post request 
    const { adminEmail } = await request.json(); 

    // Validate if the reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Review ID",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch the review by its ID
    const review = await Review.findById(reviewId);

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

    // Update the review status to "approved" and set the admin's email
    review.status = "approved";
    review.admin = adminEmail;

    // Save the updated review
    await review.save();

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

    // Update the product with the review's details
    product.productName = review.productName;
    product.price = review.price;
    product.description = review.description;
    product.productFirebaseImageLink = review.productFirebaseImageLink;
    product.productBase64ImageUrl = review.productBase64ImageUrl;

    // Save the updated product
    await product.save();

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Review approved and product updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/approve/[reviewId] :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while approving the review and updating the product",
      },
      {
        status: 500,
      }
    );
  }
}
