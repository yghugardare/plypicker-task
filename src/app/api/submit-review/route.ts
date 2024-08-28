import connectDb from "@/lib/connectDb";
import Review from "@/models/Review";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDb();

  try {
    const body = await request.json();
    const {
      productId,
      productName,
      price,
      description,
      productFirebaseImageLink,
      productBase64ImageUrl,
      author,
    } = body;

    // Validate input
    if (
      !productId ||
      !productName ||
      !price ||
      !description ||
      !productFirebaseImageLink ||
      !productBase64ImageUrl ||
      !author
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create a new review document
    const newReview = new Review({
      productId,
      productName,
      price,
      description,
      productFirebaseImageLink,
      productBase64ImageUrl,
      author,
    });

    await newReview.save();

    return NextResponse.json(
      { success: true, message: "Review submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("api/submit-review :: INTERNAL SERVER ERROR ::", error);
    return NextResponse.json(
      { success: false, message: "Server Error while submitting the review" },
      { status: 500 }
    );
  }
}
