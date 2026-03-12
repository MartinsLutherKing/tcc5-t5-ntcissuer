import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get("id");

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 },
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        user: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      certificateId: certificate.certificateId,
      student: certificate.user.name,
      email: certificate.user.email,
      wallet: certificate.user.wallet,
      course: certificate.course,
      tokenId: certificate.tokenId,
      txHash: certificate.txHash,
      metadataURI: certificate.metadataURI,
      issuedAt: certificate.createdAt,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
