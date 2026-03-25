// api/clients/[id]/content-creation-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const clientId = parseInt(id, 10);
    if (!clientId || isNaN(clientId))
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    let clientLinks = await prisma.clientLinks.findFirst({ where: { clientId } });
    if (!clientLinks) {
      clientLinks = await prisma.clientLinks.create({
        data: { clientId, strategyAiLink: "", businessSummaryLink: "", basecampLink: "", contentCreationLink: "" },
      });
    }
    return NextResponse.json({ contentCreationLink: clientLinks.contentCreationLink || "" });
  } catch (error) {
    console.error("Error in GET /content-creation-link:", error);
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
    if (!clientId || isNaN(clientId))
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });

    const { contentCreationLink } = await req.json();

    let clientLinks = await prisma.clientLinks.findFirst({ where: { clientId } });
    if (!clientLinks) {
      clientLinks = await prisma.clientLinks.create({
        data: { clientId, contentCreationLink, strategyAiLink: "", businessSummaryLink: "", basecampLink: "" },
      });
    } else {
      clientLinks = await prisma.clientLinks.update({
        where: { id: clientLinks.id },
        data: { contentCreationLink },
      });
    }
    return NextResponse.json({ success: true, contentCreationLink });
  } catch (error) {
    console.error("Error in PUT /content-creation-link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
