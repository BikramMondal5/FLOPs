import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// Runtime-only — never pre-render at build time
export const dynamic = "force-dynamic";

const defaultTestimonials = [
  {
    name: "Alex R.",
    country: "Graduate Student",
    type: "Student",
    avatar: "https://i.pravatar.cc/150?img=11",
    feedback: "FLOPs made budgeting feel effortless. The AI recommendations were simple, practical, and easy to follow.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    country: "Marketing Professional",
    type: "Professional",
    avatar: "https://i.pravatar.cc/150?img=5",
    feedback: "I finally understand where my money goes each month. The explainable AI insights make every recommendation easy to trust.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    country: "Software Engineer",
    type: "Engineer",
    avatar: "https://i.pravatar.cc/150?img=3",
    feedback: "Having all my accounts and financial goals in one dashboard has completely changed how I manage my finances.",
    rating: 5,
  },
  {
    name: "Priya M.",
    country: "Product Designer",
    type: "Designer",
    avatar: "https://i.pravatar.cc/150?img=9",
    feedback: "The personalized savings suggestions helped me stay consistent without feeling overwhelmed.",
    rating: 5,
  },
  {
    name: "Ethan C.",
    country: "Business Analyst",
    type: "Analyst",
    avatar: "https://i.pravatar.cc/150?img=8",
    feedback: "Unlike other finance apps, FLOPs explains every recommendation instead of expecting me to trust a black box.",
    rating: 5,
  },
  {
    name: "Maya T.",
    country: "Freelance Consultant",
    type: "Consultant",
    avatar: "https://i.pravatar.cc/150?img=7",
    feedback: "The clean interface and intelligent planning tools make financial management surprisingly enjoyable.",
    rating: 5,
  },
  {
    name: "Jordan W.",
    country: "Small Business Owner",
    type: "Business Owner",
    avatar: "https://i.pravatar.cc/150?img=12",
    feedback: "Secure, transparent, and genuinely useful. FLOPs feels like having a personal financial coach available anytime.",
    rating: 5,
  },
];

export async function GET() {
  try {
    const db = await connectDB();
    const testimonialsCollection = db.collection("testimonials");

    // Fetch public testimonials sorted by newest first
    let dbTestimonials: any[] = [];
    try {
      dbTestimonials = await testimonialsCollection
        .find({ allowPublic: true })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (dbError) {
      console.warn("[TESTIMONIALS DB FETCH] collection.find failed, falling back to empty. Error:", dbError);
    }

    // Map DB fields to match frontend component expectations
    const formattedDb = dbTestimonials.map((t) => ({
      name: t.name || "Anonymous",
      country: t.occupation || t.country || "User",
      type: t.primaryUse || t.type || "Feedback",
      avatar: t.avatar,
      feedback: t.feedback || "",
      rating: typeof t.rating === "number" ? t.rating : 5,
    }));

    // Merge: database testimonies first, then the default ones
    const allTestimonials = [...formattedDb, ...defaultTestimonials];

    return NextResponse.json({ success: true, data: allTestimonials });
  } catch (error) {
    console.error("[TESTIMONIALS GET] Failed completely, falling back to defaults. Error:", error);
    return NextResponse.json({ success: true, data: defaultTestimonials });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      occupation,
      primaryUse,
      frequency,
      feedback,
      rating,
      favoriteFeature,
      allowPublic,
      avatar,
    } = body;

    // Validate fields
    if (!name || !occupation || !primaryUse || !frequency || !feedback || rating === undefined) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const testimonialsCollection = db.collection("testimonials");

    const newTestimonial = {
      name,
      occupation,
      primaryUse,
      frequency,
      feedback,
      rating: Number(rating),
      favoriteFeature: favoriteFeature || "",
      allowPublic: allowPublic ?? false,
      avatar: avatar || null,
      createdAt: new Date(),
    };

    await testimonialsCollection.insertOne(newTestimonial);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TESTIMONIALS POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while saving feedback." },
      { status: 500 }
    );
  }
}
