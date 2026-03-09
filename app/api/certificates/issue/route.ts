import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, wallet, course } = body;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          wallet,
        },
      });
    }

    const certificateId = "CERT-" + uuidv4().slice(0, 8);

    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        course,
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "Certificate issued",
      certificate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 },
    );
  }
}
