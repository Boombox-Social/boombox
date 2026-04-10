// src/app/api/influencers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Tier } from "@/app/types/influencer.types";

/**
 * GET /api/influencers
 * Fetch all influencers with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tier = searchParams.get("tier");
    const niche = searchParams.get("niche");

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { tag: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tier && tier !== "all") {
      where.tier = tier as Tier;
    }

    if (niche && niche !== "all") {
      where.niche = { contains: niche, mode: "insensitive" };
    }

    const influencers = await prisma.influencerMasterList.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(influencers, { status: 200 });
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { error: "Failed to fetch influencers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/influencers
 * Create a new influencer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if username already exists (only if provided)
    if (body.username) {
      const existing = await prisma.influencerMasterList.findUnique({
        where: { username: body.username },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    // Create influencer
    const influencer = await prisma.influencerMasterList.create({
      data: {
        name: body.name,
        username: body.username,
        tag: body.tag || null,
        niche: body.niche || null,
        tiktokFollowers: body.tiktokFollowers || null,
        facebookFollowers: body.facebookFollowers || null,
        instagramFollowers: body.instagramFollowers || null,
        tier: body.tier || null,
        contentStyle: body.contentStyle || null,
        avgViews: body.avgViews || null,
        contact: body.contact || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(influencer, { status: 201 });
  } catch (error) {
    console.error("Error creating influencer:", error);
    return NextResponse.json(
      { error: "Failed to create influencer" },
      { status: 500 }
    );
  }
}
