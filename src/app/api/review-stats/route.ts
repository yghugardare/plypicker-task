import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDb();

  try {
    const url = new URL(request.url);
    const adminEmail = url.searchParams.get("adminEmail");

    // Get the total count of all reviews
    const totalReviewsCount = await Review.countDocuments();

    // Get the count of reviews accepted by the admin
    const acceptedReviewsCount = await Review.countDocuments({
      status: "approved",
      admin: adminEmail,
    });

    // Get the count of reviews rejected by the admin
    const rejectedReviewsCount = await Review.countDocuments({
      status: "rejected",
      admin: adminEmail,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalReviewsCount,
          acceptedReviewsCount,
          rejectedReviewsCount,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("api/review-stats :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching review statistics",
      },
      {
        status: 500,
      }
    );
  }
}
