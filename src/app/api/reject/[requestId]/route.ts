import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  await connectDb();

  try {
    const { requestId } = params;
    // client  will send 
    const { adminEmail } = await request.json(); 

    // Validate if the requestId is a valid Objec Id
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

    // Update the review status to "rejected" and set the admin's email addressss
    review.status = "rejected";
    review.admin = adminEmail;

    
    await review.save();

    
    return NextResponse.json(
      {
        success: true,
        message: "Review rejected successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/reject/[requestId] :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while rejecting the review",
      },
      {
        status: 500,
      }
    );
  }
}
