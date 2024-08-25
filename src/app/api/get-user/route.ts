import connectDb from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export type UserObjectType = {
  username: string;
  role: string;
  email: string;
};

export async function GET(req: NextRequest) {
  await connectDb();
  try {
    // authorization: Bearer <token>,
    // we are trying to get the token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access!",
        },
        {
          status: 401,
        }
      );
    }
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    if (!decoded) {
      console.error("JWT VERIFICATION ERROR");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token , verification of token failed!",
        },
        {
          status: 401,
        }
      );
    }
    // get user with userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        },
        {
          status: 404,
        }
      );
    }
    const userObj: UserObjectType = {
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return NextResponse.json({
      success: true,
      message: "User details sent!",
      user: userObj,
    });
  } catch (error) {
    console.error("JWT TOKEN ERROR :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cannot get user",
        user: null,
      },
      { status: 500 }
    );
  }
}
