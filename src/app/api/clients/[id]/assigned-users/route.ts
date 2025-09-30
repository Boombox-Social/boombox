import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const clientId = parseInt(id, 10);
    if (!clientId || isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    // Get assigned user IDs for the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { assignedUserIds: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!client.assignedUserIds || client.assignedUserIds.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Get user details for assigned SMMs
    const users = await prisma.user.findMany({
      where: {
        id: { in: client.assignedUserIds },
        role: "SMM",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching assigned SMMs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}