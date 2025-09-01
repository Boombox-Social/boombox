// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(clients);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Expect body to have fields matching NewClientForm-ish.
    // Convert comma-separated strings to arrays if necessary.
    const {
      name,
      info,
      logoUrl,
      industry,
      links,
      niche,
      businessAge,
      description,
      coreProducts,
      idealCustomer,
      brandEmotion,
      uniqueSelling,
      mainGoal,
      competitors,
      inspo,
      brandColors,
      fontUsed,
    } = body;

    const created = await prisma.client.create({
      data: {
        name,
        info,
        logoUrl: logoUrl ?? null,
        industry,
        links: Array.isArray(links) ? links : (links ? links.split(",").map((s:string)=>s.trim()).filter(Boolean) : []),
        niche,
        businessAge,
        description,
        coreProducts: Array.isArray(coreProducts) ? coreProducts : (coreProducts ? coreProducts.split(",").map((s:string)=>s.trim()).filter(Boolean) : []),
        idealCustomer,
        brandEmotion,
        uniqueSelling,
        mainGoal,
        competitors: Array.isArray(competitors) ? competitors : (competitors ? competitors.split(",").map((s:string)=>s.trim()).filter(Boolean) : []),
        inspo: Array.isArray(inspo) ? inspo : (inspo ? inspo.split(",").map((s:string)=>s.trim()).filter(Boolean) : []),
        brandColors,
        fontUsed,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return new NextResponse("Missing id", { status: 400 });

    const updated = await prisma.client.update({
      where: { id: BigInt(body.id) as any }, // or Number(body.id) if Int
      data: {
        ...body,
        // Convert arrays if necessary
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing id", { status: 400 });

    await prisma.client.delete({ where: { id: BigInt(id) as any } });
    return new NextResponse("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
