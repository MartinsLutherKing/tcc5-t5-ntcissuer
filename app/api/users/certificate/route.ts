import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      studentName,
      walletAddress,
      courseName,
      completionDate,
      certificateId,
    } = body;

    const metadata = {
      name: "Bootcamp Certificate NFT",
      description: "NFT certificate issued to a bootcamp student",
      attributes: [
        { trait_type: "Student Name", value: studentName },
        { trait_type: "Course", value: courseName },
        { trait_type: "Completion Date", value: completionDate },
        { trait_type: "Certificate ID", value: certificateId },
      ],
    };

    return NextResponse.json({
      success: true,
      metadata,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Something went wrong",
    });
  }
}