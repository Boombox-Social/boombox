// api/auth/seed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseUtils } from '../../../utils/db.utils';

export async function POST(_request: NextRequest) { // Add underscore prefix
  try {
     const authHeader = _request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Create default super admin user
    const result = await DatabaseUtils.seedSuperAdmin();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Super admin user created successfully',
      user: result 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create super admin user' },
      { status: 500 }
    );
  }
}