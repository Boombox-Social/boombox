import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../utils/auth.utils';
import { DatabaseUtils } from '../../../utils/db.utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('🔐 Sign in attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists first
    console.log('🔍 Checking if user exists:', email);
    const user = await DatabaseUtils.findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      isActive: user.isActive 
    });

    if (!user.isActive) {
      console.log('❌ User is inactive:', email);
      return NextResponse.json(
        { error: 'Account is inactive. Please contact an administrator.' },
        { status: 403 }
      );
    }

    // Authenticate user using the database
    console.log('🔍 Attempting to authenticate:', email);
    const authResult = await AuthUtils.authenticateUser(email, password);
    console.log('✅ Authentication successful for:', email);

    // Create response with user data and tokens
    const response = NextResponse.json({
      message: 'Sign in successful',
      user: authResult.user,
      token: authResult.accessToken,
      refreshToken: authResult.refreshToken
    });

    // Set HTTP-only cookies for security
    response.cookies.set('auth-token', authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    response.cookies.set('refresh-token', authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ Sign in successful for:', email);
    return response;

  } catch (error) {
    console.error('❌ Signin error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      console.log('Error message:', error.message);
      
      if (error.message === 'Invalid credentials') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('inactive')) {
        return NextResponse.json(
          { error: 'Account is inactive. Please contact an administrator.' },
          { status: 403 }
        );
      }

      // JWT errors
      if (error.message.includes('JWT') || error.message.includes('secret')) {
        console.log('❌ JWT configuration error - check your JWT_SECRET');
        return NextResponse.json(
          { error: 'Authentication configuration error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}