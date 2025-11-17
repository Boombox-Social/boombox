import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    // Fetch user from database with caching
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      );
    }

    // Return user data with cache headers
    const response = NextResponse.json({ user });
    
    // Set cache headers to cache for 5 minutes
    response.headers.set('Cache-Control', 'private, max-age=300');
    
    return response;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}