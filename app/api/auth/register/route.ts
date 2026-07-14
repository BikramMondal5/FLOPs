import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { signupSchema } from "@/lib/schemas/auth";

// Runtime-only — never pre-render at build time
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ─────────────────────────────────────────────
    // 1. Validate input with Zod
    // ─────────────────────────────────────────────
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: errors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // ─────────────────────────────────────────────
    // 2. Connect to database
    // ─────────────────────────────────────────────
    const db = await connectDB();
    const usersCollection = db.collection("users");

    // ─────────────────────────────────────────────
    // 3. Check for duplicate email
    // ─────────────────────────────────────────────
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ─────────────────────────────────────────────
    // 4. Hash password (salt rounds: 12)
    // ─────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ─────────────────────────────────────────────
    // 5. Create user document with all default fields
    // ─────────────────────────────────────────────
    const now = new Date();
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: null,
      role: "user",
      currency: "INR",
      country: "India",
      language: "English",
      timezone: "Asia/Kolkata",
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await usersCollection.insertOne(newUser);

    // ─────────────────────────────────────────────
    // 6. Return success (never expose the password hash)
    // ─────────────────────────────────────────────
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.insertedId.toString(),
          name,
          email: email.toLowerCase(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
