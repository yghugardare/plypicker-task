
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/connectDb";

export async function POST(req: Request) {
  await connectDb();
  try {
    const { username, email, password, role } = await req.json();
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with same email already exists!" },
        { status: 400 }
      );
    }
    // hash the password
    const hashedPassoword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassoword,
      role,
    });
    await newUser.save();
    return NextResponse.json(
      { success: true, message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
