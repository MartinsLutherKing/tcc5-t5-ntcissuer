import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[/api/certificates/issue] Request body:", body);

    const {
      userId,
      email,
      course,
      bootcampId,
      name,
      wallet,
      studentId,
      studentName,
    } = body;

    // Validate required fields
    if (!course || !bootcampId) {
      console.log("[/api/certificates/issue] Missing: course or bootcampId", {
        course,
        bootcampId,
      });
      return NextResponse.json(
        {
          error: "Missing required fields: course, bootcampId",
        },
        { status: 400 },
      );
    }

    // Either userId or email must be provided
    if (!userId && !email) {
      console.log("[/api/certificates/issue] Missing: userId or email", {
        userId,
        email,
      });
      return NextResponse.json(
        {
          error: "Must provide either userId or email",
        },
        { status: 400 },
      );
    }

    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || email,
            email,
            wallet,
          },
        });
      }
    }

    // Check if certificate already exists for this user and bootcamp
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        bootcampId,
      },
    });

    if (existingCertificate) {
      return NextResponse.json(
        { error: "Certificate already exists for this user and bootcamp" },
        { status: 409 },
      );
    }

    const certificateId = "CERT-" + uuidv4().slice(0, 8);

    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        course,
        userId: user.id,
        bootcampId,
        email: user.email,
        studentId: studentId || uuidv4(),
        studentName: studentName || user.name,
      },
    });

    return NextResponse.json({
      message: "Certificate issued",
      certificate,
    });
  } catch (error) {
    console.error("[/api/certificates/issue] Error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "Certificate already exists for this student and bootcamp" },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to issue certificate",
      },
      { status: 500 },
    );
  }
}
