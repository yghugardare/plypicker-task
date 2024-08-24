import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await connectDb();
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User with given email address Not Found!",
        },
        {
          status: 404,
        }
      );
    }
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password credential!",
        },
        {
          status: 401,
        }
      );
    }
    // sign jwt token to main session of that user
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return NextResponse.json({success:true ,token },{
        status:200
    })
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Loging in user",
      },
      { status: 500 }
    );
  }
}
