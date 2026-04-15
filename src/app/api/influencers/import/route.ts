// src/app/api/influencers/import/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Tier } from "@/app/types/influencer.types";

/**
 * POST /api/influencers/import
 * Bulk import influencers from CSV data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const [index, row] of data.entries()) {
      try {
        // Validate required fields
        if (!row.name) {
          results.failed++;
          results.errors.push(
            `Row ${index + 1}: Name is required`
          );
          continue;
        }

        // Check if username already exists (only if provided)
        if (row.username) {
          const existing = await prisma.influencerMasterList.findUnique({
            where: { username: row.username },
          });

          if (existing) {
            results.failed++;
            results.errors.push(
              `Row ${index + 1}: Username "${row.username}" already exists`
            );
            continue;
          }
        }

        // Validate tier if provided
        let tier: Tier | null = null;
        if (row.tier) {
          const tierUpper = row.tier.toUpperCase();
          if (["A", "B", "C", "D"].includes(tierUpper)) {
            tier = tierUpper as Tier;
          }
        }

        // Create influencer
        await prisma.influencerMasterList.create({
          data: {
            name: row.name,
            username: row.username,
            tag: row.tag || null,
            niche: row.niche || null,
            tiktokFollowers: row.tiktokFollowers || null,
            facebookFollowers: row.facebookFollowers || null,
            instagramFollowers: row.instagramFollowers || null,
            tier,
            contentStyle: row.contentStyle || null,
            avgViews: row.avgViews || null,
            contact: row.contact || null,
            notes: row.notes || null,
          },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Row ${index + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error importing influencers:", error);
    return NextResponse.json(
      { error: "Failed to import influencers" },
      { status: 500 }
    );
  }
}
