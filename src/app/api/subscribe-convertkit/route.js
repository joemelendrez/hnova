// FIXED CONVERTKIT API ROUTE
// /api/subscribe-convertkit/route.js

import { NextResponse } from 'next/server';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_TAG_ID = process.env.CONVERTKIT_TAG_ID;

export async function POST(request) {
  console.log('🔍 ConvertKit API route called');

  try {
    const { email } = await request.json();
    console.log('📧 Email received:', email);

    // Debug environment variables
    console.log('🔑 API key exists:', !!CONVERTKIT_API_KEY);
    console.log('🔑 API key length:', CONVERTKIT_API_KEY?.length);
    console.log('🏷️ Tag ID:', CONVERTKIT_TAG_ID);

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!CONVERTKIT_API_KEY) {
      console.error('❌ No ConvertKit API key found');
      return NextResponse.json(
        { error: 'Server configuration error - missing API key' },
        { status: 500 }
      );
    }

    if (!CONVERTKIT_TAG_ID) {
      console.error('❌ No ConvertKit tag ID found');
      return NextResponse.json(
        { error: 'Server configuration error - missing tag ID' },
        { status: 500 }
      );
    }

    // Subscribe to ConvertKit using tag
    const convertkitUrl = `https://api.convertkit.com/v3/tags/${CONVERTKIT_TAG_ID}/subscribe`;

    const requestBody = {
      api_secret: CONVERTKIT_API_KEY, // Use api_secret for tag endpoints
      email: email,
      fields: {
        source: 'Habit Formation Guide',
        signup_date: new Date().toISOString().split('T')[0],
      },
    };

    console.log('📤 Sending subscription request to:', convertkitUrl);

    const convertkitResponse = await fetch(convertkitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const convertkitData = await convertkitResponse.json();
    console.log('📥 ConvertKit response status:', convertkitResponse.status);
    console.log('📄 ConvertKit response data:', convertkitData);

    if (!convertkitResponse.ok) {
      console.error('❌ ConvertKit subscription error:', convertkitData);

      // Handle specific errors
      if (
        convertkitData.message?.includes('already subscribed') ||
        convertkitData.message?.includes('already exists')
      ) {
        console.log('ℹ️ User already subscribed - treating as success');
        return NextResponse.json({
          success: true,
          message: 'Guide is being sent to your email!',
        });
      }

      return NextResponse.json(
        {
          error: `Subscription failed: ${
            convertkitData.message || 'Unknown error'
          }`,
        },
        { status: 400 }
      );
    }

    console.log('✅ Successfully subscribed to ConvertKit');

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email.',
    });
  } catch (error) {
    console.error('💥 Subscription error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
