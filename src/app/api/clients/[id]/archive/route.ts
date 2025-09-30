import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../../utils/auth.utils';
import { DatabaseUtils } from '../../../../utils/db.utils';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params; 
    const clientId = parseInt(id);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid client ID' },
        { status: 400 }
      );
    }

    const user = await AuthUtils.getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN can archive clients
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only Super Admins can archive clients' },
        { status: 403 }
      );
    }

    // Find the client
    const client = await DatabaseUtils.findClientById(clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Archive the client (copy to archived_clients)
    await DatabaseUtils.archiveClient(client);

    // Delete the original client
    await DatabaseUtils.deleteClient(clientId);

    return NextResponse.json({
      success: true,
      message: 'Client archived successfully'
    });
  } catch (error) {
    console.error('Error archiving client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive client' },
      { status: 500 }
    );
  }
}