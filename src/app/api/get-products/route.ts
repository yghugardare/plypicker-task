import connectDb from "@/lib/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  try {
    const products = await Product.find(); // Fetch all products from the database
    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "api/get-products/route.ts :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while fetching the Products",
      },
      {
        status: 500,
      }
    );
  }
}
