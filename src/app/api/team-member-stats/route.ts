import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDb();

  try {
    const url = new URL(request.url);
    const authorEmail = url.searchParams.get("authorEmail");

    if (!authorEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Author email is required",
        },
        {
          status: 400,
        }
      );
    }

    // Get the total number of requests made by the author
    const totalRequestsCount = await Review.countDocuments({ author: authorEmail });

    // Get the total number of requests that got accepted by the author
    const acceptedRequestsCount = await Review.countDocuments({
      author: authorEmail,
      status: "approved",
    });

    // Get the total number of requests that got rejected by the author
    const rejectedRequestsCount = await Review.countDocuments({
      author: authorEmail,
      status: "rejected",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalRequestsCount,
          acceptedRequestsCount,
          rejectedRequestsCount,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("api/team-member-stats :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching team member statistics",
      },
      {
        status: 500,
      }
    );
  }
}
