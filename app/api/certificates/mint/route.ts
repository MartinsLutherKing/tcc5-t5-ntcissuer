import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { studentId, studentName, email, bootcampId } = body;

    if (!studentId || !bootcampId) {
      return NextResponse.json(
        { success: false, message: "studentId and bootcampId required" },
        { status: 400 },
      );
    }

    const existing = await prisma.certificate.findFirst({
      where: { studentId, bootcampId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Certificate already issued" },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student eligible for minting",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
