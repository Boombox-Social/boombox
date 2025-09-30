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

    // Find or create ClientLinks for this client
    let clientLinks = await prisma.clientLinks.findFirst({ where: { clientId } });
    if (!clientLinks) {
      clientLinks = await prisma.clientLinks.create({
        data: {
          clientId,
          strategyAiLink: "",
          businessSummaryLink: "",
          basecampLink: "",
        },
      });
    }

    return NextResponse.json({
      basecampLink: clientLinks.basecampLink || "",
    });
  } catch (error) {
    console.error("Error in GET /basecamp-link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const clientId = parseInt(id, 10);
    if (!clientId || isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const { basecampLink } = await req.json();

    let clientLinks = await prisma.clientLinks.findFirst({ where: { clientId } });
    if (!clientLinks) {
      clientLinks = await prisma.clientLinks.create({
        data: {
          clientId,
          basecampLink,
          strategyAiLink: "",
          businessSummaryLink: "",
        },
      });
    } else {
      clientLinks = await prisma.clientLinks.update({
        where: { id: clientLinks.id },
        data: { basecampLink },
      });
    }

    return NextResponse.json({ success: true, basecampLink });
  } catch (error) {
    console.error("Error in PUT /basecamp-link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}