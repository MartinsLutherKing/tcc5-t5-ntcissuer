import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        wallet: body.wallet,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const user = await prisma.user.create({
//       data: {
//         name: body.name,
//         email: body.email,
//         wallet: body.wallet,
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
// export async function GET() {
//   const users = await prisma.user.findMany();
//   return NextResponse.json(users);
// }

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { error: "Must provide either id or email query parameter" },
        { status: 400 },
      );
    }

    // Delete associated certificates first (to handle foreign key constraints)
    if (userId) {
      await prisma.certificate.deleteMany({
        where: { userId },
      });
    } else if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.certificate.deleteMany({
          where: { userId: user.id },
        });
      }
    }

    // Delete the user
    const whereClause = userId ? { id: userId } : { email: email! };
    const deletedUser = await prisma.user.delete({
      where: whereClause,
    });

    return NextResponse.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}