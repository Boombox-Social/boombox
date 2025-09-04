// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Convert BigInt IDs to string for JSON serialization
    const serializedClients = clients.map((c) => ({
      ...c,
      id: c.id.toString(),
    }));

    return NextResponse.json(serializedClients);
  } catch (err: any) {
    console.error("GET /clients failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// POST a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.info || !body.industry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const created = await prisma.client.create({
      data: {
        name: body.name,
        info: body.info,
        logoUrl: body.logoUrl ?? null,
        industry: body.industry,
        links: Array.isArray(body.links)
          ? body.links
          : body.links
          ? body.links.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        niche: body.niche ?? null,
        businessAge: body.businessAge ?? null,
        description: body.description ?? null,
        coreProducts: Array.isArray(body.coreProducts)
          ? body.coreProducts
          : body.coreProducts
          ? body.coreProducts.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        idealCustomer: body.idealCustomer ?? null,
        brandEmotion: body.brandEmotion ?? null,
        uniqueSelling: body.uniqueSelling ?? null,
        mainGoal: body.mainGoal ?? null,
        competitors: Array.isArray(body.competitors)
          ? body.competitors
          : body.competitors
          ? body.competitors.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        inspo: Array.isArray(body.inspo)
          ? body.inspo
          : body.inspo
          ? body.inspo.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        brandColors: body.brandColors ?? null,
        fontUsed: body.fontUsed ?? null,
      },
    });

    // Convert BigInt id to string for frontend compatibility
    const serializedCreated = { ...created, id: created.id.toString() };

    return NextResponse.json(serializedCreated);
  } catch (error: any) {
    console.error("POST /clients error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// PUT (update) a client
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing client id" },
        { status: 400 }
      );
    }

    const updated = await prisma.client.update({
      where: { id: BigInt(body.id) }, // must cast to BigInt
      data: {
        name: body.name,
        info: body.info,
        logoUrl: body.logoUrl ?? null,
        industry: body.industry,
        links: Array.isArray(body.links)
          ? body.links
          : body.links
          ? body.links.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        niche: body.niche ?? null,
        businessAge: body.businessAge ?? null,
        description: body.description ?? null,
        coreProducts: Array.isArray(body.coreProducts)
          ? body.coreProducts
          : body.coreProducts
          ? body.coreProducts.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        idealCustomer: body.idealCustomer ?? null,
        brandEmotion: body.brandEmotion ?? null,
        uniqueSelling: body.uniqueSelling ?? null,
        mainGoal: body.mainGoal ?? null,
        competitors: Array.isArray(body.competitors)
          ? body.competitors
          : body.competitors
          ? body.competitors.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        inspo: Array.isArray(body.inspo)
          ? body.inspo
          : body.inspo
          ? body.inspo.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        brandColors: body.brandColors ?? null,
        fontUsed: body.fontUsed ?? null,
      },
    });

    const serialized = { ...updated, id: updated.id.toString() };

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error("PUT /clients error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE a client
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.client.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /clients error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
