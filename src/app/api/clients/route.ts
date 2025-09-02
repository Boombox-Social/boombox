import { NextRequest, NextResponse } from 'next/server';
import { DatabaseUtils } from '../../utils/db.utils';
import { AuthUtils } from '../../utils/auth.utils';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/clients - Starting request');
    
    // Use your existing auth system
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('POST /api/clients - No auth token');
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      console.log('POST /api/clients - Invalid token');
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid token' 
        },
        { status: 401 }
      );
    }

    const currentUser = await DatabaseUtils.findUserById(payload.userId);
    if (!currentUser || !currentUser.isActive) {
      console.log('POST /api/clients - User not found or inactive');
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found or inactive' 
        },
        { status: 401 }
      );
    }

    const clientData = await request.json();
    console.log('POST /api/clients - Client data received:', {
      name: clientData.name,
      industry: clientData.industry,
      address: clientData.address,
      links: clientData.links,
      coreProducts: clientData.coreProducts,
      competitors: clientData.competitors,
      indirectCompetitors: clientData.indirectCompetitors,
      fontUsed: clientData.fontUsed,
      brandAssets: clientData.brandAssets
    });

    // Validate required fields
    if (!clientData.name?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Client name is required' 
        },
        { status: 400 }
      );
    }

    if (!clientData.industry?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Industry is required' 
        },
        { status: 400 }
      );
    }

    if (!clientData.address?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Address is required' 
        },
        { status: 400 }
      );
    }

    console.log('POST /api/clients - Creating client in database');

    // Ensure arrays are properly formatted
    const newClient = await DatabaseUtils.createClient({
      name: clientData.name,
      logo: clientData.logo || null,
      address: clientData.address,
      industry: clientData.industry,
      slogan: clientData.slogan || null,
      links: Array.isArray(clientData.links) ? clientData.links : [],
      coreProducts: Array.isArray(clientData.coreProducts) ? clientData.coreProducts : [],
      idealCustomers: clientData.idealCustomers || null,
      brandEmotion: clientData.brandEmotion || null,
      uniqueProposition: clientData.uniqueProposition || null,
      whyChooseUs: clientData.whyChooseUs || null,
      mainGoal: clientData.mainGoal || null,
      shortTermGoal: clientData.shortTermGoal || null,
      longTermGoal: clientData.longTermGoal || null,
      competitors: Array.isArray(clientData.competitors) ? clientData.competitors : [],
      indirectCompetitors: Array.isArray(clientData.indirectCompetitors) ? clientData.indirectCompetitors : [],
      brandAssets: Array.isArray(clientData.brandAssets) ? clientData.brandAssets : [],
      fontUsed: Array.isArray(clientData.fontUsed) ? clientData.fontUsed : [],
      smmDriveLink: clientData.smmDriveLink || null,
      contractDeliverables: clientData.contractDeliverables || null,
      createdById: currentUser.id,
      assignedUserId: clientData.assignedUserId || currentUser.id,
    });

    console.log('POST /api/clients - Client created successfully:', {
      id: newClient.id,
      name: newClient.name,
      links: newClient.links,
      coreProducts: newClient.coreProducts,
      competitors: newClient.competitors,
      indirectCompetitors: newClient.indirectCompetitors,
      fontUsed: newClient.fontUsed,
      brandAssets: newClient.brandAssets
    });

    // Transform database client to match frontend Client type
    const transformedClient = {
      id: newClient.id,
      name: newClient.name,
      logo: newClient.logo,
      address: newClient.address,
      industry: newClient.industry,
      slogan: newClient.slogan,
      links: newClient.links,
      coreProducts: newClient.coreProducts,
      idealCustomers: newClient.idealCustomers,
      brandEmotion: newClient.brandEmotion,
      uniqueProposition: newClient.uniqueProposition,
      whyChooseUs: newClient.whyChooseUs,
      mainGoal: newClient.mainGoal,
      shortTermGoal: newClient.shortTermGoal,
      longTermGoal: newClient.longTermGoal,
      competitors: newClient.competitors,
      indirectCompetitors: newClient.indirectCompetitors,
      brandAssets: newClient.brandAssets,
      fontUsed: newClient.fontUsed,
      smmDriveLink: newClient.smmDriveLink,
      contractDeliverables: newClient.contractDeliverables,
      createdAt: newClient.createdAt.toISOString(),
      updatedAt: newClient.updatedAt.toISOString(),
    };

    console.log('POST /api/clients - Sending response');

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client: transformedClient
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/clients - Error creating client:', error);
    
    // Handle Prisma specific errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'A client with this name already exists' 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create client',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method remains the same...
export async function GET(request: NextRequest) {
  try {
    // Use your existing auth system
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

    // Use your existing findClientsByUser method
    const clients = await DatabaseUtils.findClientsByUser(currentUser.id, currentUser.role);
    
    // Transform database clients to match frontend Client type
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
    }, { status: 200 });
    
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}