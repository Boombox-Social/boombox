import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../utils/auth.utils';
import { DatabaseUtils } from '../../utils/db.utils';
import { UserRole } from '@prisma/client'; // Fix import path

// GET /api/clients - Get all clients for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const currentUser = await DatabaseUtils.findUserById(payload.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Get clients based on user role using the existing method
    const clients = await DatabaseUtils.findClientsByUser(currentUser.id, currentUser.role);

    // Transform clients for frontend
    const transformedClients = clients.map(client => ({
      id: client.id,
      name: client.name,
      logo: client.logo,
      address: client.address,
      industry: client.industry,
      slogan: client.slogan,
      links: client.links,
      coreProducts: client.coreProducts,
      idealCustomers: client.idealCustomers,
      brandEmotion: client.brandEmotion,
      uniqueProposition: client.uniqueProposition,
      whyChooseUs: client.whyChooseUs,
      mainGoal: client.mainGoal,
      shortTermGoal: client.shortTermGoal,
      longTermGoal: client.longTermGoal,
      competitors: client.competitors,
      indirectCompetitors: client.indirectCompetitors,
      brandAssets: client.brandAssets,
      fontUsed: client.fontUsed,
      smmDriveLink: client.smmDriveLink,
      contractDeliverables: client.contractDeliverables,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    }));

    return NextResponse.json({ 
      success: true,
      clients: transformedClients 
    });
  } catch (error: unknown) {
    // Remove console.error or wrap with production check
    return NextResponse.json(
      { error: "Failed to load clients" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const currentUser = await DatabaseUtils.findUserById(payload.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    const clientData = await request.json();

    // Validate required fields
    if (!clientData.name?.trim()) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    // Create client
    const newClient = await DatabaseUtils.createClient({
      ...clientData,
      createdById: currentUser.id,
      assignedUserId: clientData.assignedUserId || currentUser.id,
    });

    // Transform for frontend
    const transformedClient = {
      id: newClient.id,
      name: newClient.name,
      logo: newClient.logo,
      address: newClient.address,
      industry: newClient.industry,
      slogan: newClient.slogan,
      links: newClient.links || [],
      coreProducts: newClient.coreProducts || [],
      idealCustomers: newClient.idealCustomers,
      brandEmotion: newClient.brandEmotion,
      uniqueProposition: newClient.uniqueProposition,
      whyChooseUs: newClient.whyChooseUs,
      mainGoal: newClient.mainGoal,
      shortTermGoal: newClient.shortTermGoal,
      longTermGoal: newClient.longTermGoal,
      competitors: newClient.competitors || [],
      indirectCompetitors: newClient.indirectCompetitors || [],
      brandAssets: newClient.brandAssets || [],
      fontUsed: newClient.fontUsed || [],
      smmDriveLink: newClient.smmDriveLink,
      contractDeliverables: newClient.contractDeliverables,
      createdAt: newClient.createdAt.toISOString(),
      updatedAt: newClient.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Client created successfully",
      client: transformedClient,
    }, { status: 201 });

  } catch (error: unknown) {
    // Remove console.error or wrap with production check
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}