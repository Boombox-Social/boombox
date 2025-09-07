// api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../utils/auth.utils';
import { DatabaseUtils } from '../../utils/db.utils';

// GET /api/clients - Get all clients for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await AuthUtils.getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const clients = await DatabaseUtils.getClientsByUser(user);
    
    return NextResponse.json({
      success: true,
      clients
    });
    
  } catch (_error) { // Add underscore prefix
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const user = await AuthUtils.getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (!body.address?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Business address is required' },
        { status: 400 }
      );
    }

    if (!body.industry?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Industry is required' },
        { status: 400 }
      );
    }

    // Create client with user association
    const clientData = {
      ...body,
      createdById: user.id,
      // For SMM role, assign to themselves, for ADMIN/SUPER_ADMIN assign to specified user or null
      assignedUserId: user.role === 'SMM' ? user.id : (body.assignedUserId || null)
    };

    const client = await DatabaseUtils.createClient(clientData);
    
    return NextResponse.json({
      success: true,
      client,
      message: 'Client created successfully'
    });
    
  } catch (_error) { // Add underscore prefix
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}