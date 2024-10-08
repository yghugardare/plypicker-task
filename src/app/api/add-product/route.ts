import connectDb from "@/lib/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDb();
  try {
    let {
      productName,
      price,
      description,
      productFirebaseImageLink,
      productBase64ImageUrl,
      imgType
    } = await req.json();
    if (!productFirebaseImageLink) {
      return NextResponse.json(
        {
          success: false,
          message: "Product Image Link Not Provided!",
        },
        {
          status: 400,
        }
      );
    }
    if (!productBase64ImageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Product Base 64 Link Not Provided!",
        },
        {
          status: 400,
        }
      );
    }

    const newProduct = new Product({
      productBase64ImageUrl,
      productName,
      productFirebaseImageLink,
      description,
      price,
      imgType
    });
    // console.log({
    //   productBase64ImageUrl,
    //   productName,
    //   productFirebaseImageLink,
    //   description,
    //   price,
    // })
    await newProduct.save();
    return NextResponse.json(
      {
        success: true,
        message: "New Product Added!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "api/add-product/route.ts :: INTERNAL SERVER ERROR ::",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server Error while adding the Product",
      },
      {
        status: 500,
      }
    );
  }
}
