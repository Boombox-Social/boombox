import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret";
const ACCESS_TOKEN_EXPIRY = "7d";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: number;
      email: string;
    };

    // Fetch user
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

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 404 }
      );
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const response = NextResponse.json({
      message: "Token refreshed",
      user,
    });

    // Set new access token cookie
    response.cookies.set("auth-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: "Refresh token expired" },
        { status: 401 }
      );
    }

    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}