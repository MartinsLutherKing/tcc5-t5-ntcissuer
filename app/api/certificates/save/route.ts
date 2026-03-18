import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { certificateId, tokenId, txHash, metadataCid } = body;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.certificate.update({
      where: { certificateId },
      data: { tokenId, txHash, metadataCid },
    });

    return NextResponse.json({
      message: "Certificate saved",
      certificate: updated,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
