import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../utils/auth.utils';
import { DatabaseUtils } from '../../../utils/db.utils';
import { UserRole } from '../../../../generated/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

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

    const client = await DatabaseUtils.findClientById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Transform database client to match frontend Client type
    const transformedClient = {
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
    };

    return NextResponse.json({ client: transformedClient });
  } catch (error) {
    console.error("Get client error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

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

    const clientData = await request.json();

    // Validate required fields
    if (!clientData.name?.trim()) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    const updatedClient = await DatabaseUtils.updateClient(clientId, {
      name: clientData.name,
      logo: clientData.logo || null,
      address: clientData.address || null,
      industry: clientData.industry || null,
      slogan: clientData.slogan || null,
      links: clientData.links || [],
      coreProducts: clientData.coreProducts || [],
      idealCustomers: clientData.idealCustomers || null,
      brandEmotion: clientData.brandEmotion || null,
      uniqueProposition: clientData.uniqueProposition || null,
      whyChooseUs: clientData.whyChooseUs || null,
      mainGoal: clientData.mainGoal || null,
      shortTermGoal: clientData.shortTermGoal || null,
      longTermGoal: clientData.longTermGoal || null,
      competitors: clientData.competitors || [],
      indirectCompetitors: clientData.indirectCompetitors || [],
      brandAssets: clientData.brandAssets || [],
      fontUsed: clientData.fontUsed || [],
      smmDriveLink: clientData.smmDriveLink || null,
      contractDeliverables: clientData.contractDeliverables || null,
      assignedUserId: clientData.assignedUserId || null,
    });

    // Transform database client to match frontend Client type
    const transformedClient = {
      id: updatedClient.id,
      name: updatedClient.name,
      logo: updatedClient.logo,
      address: updatedClient.address,
      industry: updatedClient.industry,
      slogan: updatedClient.slogan,
      links: updatedClient.links,
      coreProducts: updatedClient.coreProducts,
      idealCustomers: updatedClient.idealCustomers,
      brandEmotion: updatedClient.brandEmotion,
      uniqueProposition: updatedClient.uniqueProposition,
      whyChooseUs: updatedClient.whyChooseUs,
      mainGoal: updatedClient.mainGoal,
      shortTermGoal: updatedClient.shortTermGoal,
      longTermGoal: updatedClient.longTermGoal,
      competitors: updatedClient.competitors,
      indirectCompetitors: updatedClient.indirectCompetitors,
      brandAssets: updatedClient.brandAssets,
      fontUsed: updatedClient.fontUsed,
      smmDriveLink: updatedClient.smmDriveLink,
      contractDeliverables: updatedClient.contractDeliverables,
      createdAt: updatedClient.createdAt.toISOString(),
      updatedAt: updatedClient.updatedAt.toISOString(),
    };

    return NextResponse.json({
      message: "Client updated successfully",
      client: transformedClient,
    });
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;
    const clientId = parseInt(id);
    
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

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

    await DatabaseUtils.deleteClient(clientId);

    return NextResponse.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}