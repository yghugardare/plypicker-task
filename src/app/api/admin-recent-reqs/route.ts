import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDb();

  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User email is required",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch the most recent reviews that were either accepted or rejected, excluding the current user's requests, limiting the result to 5
    const recentReviews = await Review.find({
      status: { $in: ["approved", "rejected"] },
      admin: userEmail, 
    })
      .sort({ updatedAt: -1 }) // Sort by the most recent first
      .limit(5) // Limit the results to 5
      .select("productId productName status author"); // Select only the required fields

    return NextResponse.json(
      {
        success: true,
        data: recentReviews,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("api/admin-recent-reqs :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching recent reviews",
      },
      {
        status: 500,
      }
    );
  }
}
