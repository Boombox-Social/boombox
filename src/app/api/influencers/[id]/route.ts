// src/app/api/influencers/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * PATCH /api/influencers/[id]
 * Update an influencer
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid influencer ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // If username is being updated, check for uniqueness
    if (body.username) {
      const existing = await prisma.influencerMasterList.findFirst({
        where: {
          username: body.username,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    // Update influencer
    const influencer = await prisma.influencerMasterList.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.username !== undefined && { username: body.username }),
        ...(body.tag !== undefined && { tag: body.tag || null }),
        ...(body.niche !== undefined && { niche: body.niche || null }),
        ...(body.tiktokFollowers !== undefined && {
          tiktokFollowers: body.tiktokFollowers || null,
        }),
        ...(body.facebookFollowers !== undefined && {
          facebookFollowers: body.facebookFollowers || null,
        }),
        ...(body.instagramFollowers !== undefined && {
          instagramFollowers: body.instagramFollowers || null,
        }),
        ...(body.tier !== undefined && { tier: body.tier || null }),
        ...(body.contentStyle !== undefined && {
          contentStyle: body.contentStyle || null,
        }),
        ...(body.avgViews !== undefined && { avgViews: body.avgViews || null }),
        ...(body.contact !== undefined && { contact: body.contact || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      },
    });

    return NextResponse.json(influencer, { status: 200 });
  } catch (error: any) {
    console.error("Error updating influencer:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update influencer" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/influencers/[id]
 * Delete an influencer
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid influencer ID" },
        { status: 400 }
      );
    }

    await prisma.influencerMasterList.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Influencer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting influencer:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete influencer" },
      { status: 500 }
    );
  }
}
