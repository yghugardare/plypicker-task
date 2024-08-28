import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();

  try {
    const pendingRequests = await Review.find({ status: "pending" });

    return NextResponse.json(
      { success: true, data: pendingRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("api/pending-requests :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      { success: false, message: "Server Error while fetching pending requests" },
      { status: 500 }
    );
  }
}
