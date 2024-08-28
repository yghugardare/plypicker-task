
import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const authorEmail = searchParams.get('email');

  if (!authorEmail) {
    return NextResponse.json(
      { success: false, message: "Author email is required" },
      { status: 400 }
    );
  }

  try {
    const submissions = await Review.find({ author: authorEmail });
    

    return NextResponse.json(
      { success: true, data: submissions },
      { status: 200 }
    );
  } catch (error) {
    console.error("api/my-submissions :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      { success: false, message: "Server Error while fetching submissions" },
      { status: 500 }
    );
  }
}
