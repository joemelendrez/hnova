// /api/subscribe-convertkit/route.js

import { NextResponse } from 'next/server';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_TAG_ID = process.env.CONVERTKIT_TAG_ID; // We'll use tags instead of forms

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!CONVERTKIT_API_KEY) {
      console.error('ConvertKit API key not found');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Subscribe to ConvertKit using tag (this triggers the sequence)
    const convertkitResponse = await fetch(
      `https://api.convertkit.com/v3/tags/${CONVERTKIT_TAG_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
          fields: {
            source: 'Habit Formation Guide',
            signup_date: new Date().toISOString().split('T')[0],
          },
        }),
      }
    );

    const convertkitData = await convertkitResponse.json();

    if (!convertkitResponse.ok) {
      console.error('ConvertKit error:', convertkitData);

      // Handle specific ConvertKit errors
      if (
        convertkitData.message &&
        convertkitData.message.includes('already subscribed')
      ) {
        // User already exists - that's okay, still count as success
        return NextResponse.json({
          success: true,
          message: 'Email sent! (You may already be subscribed)',
        });
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 400 }
      );
    }

    console.log('ConvertKit success:', convertkitData);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Alternative version using forms instead of tags
// Uncomment this if you prefer to use a ConvertKit form

/*
export async function POST_FORM_VERSION(request) {
  try {
    const { email } = await request.json();
    
    const convertkitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
          tags: ['habit-guide-download'], // Optional: add tags
          fields: {
            source: 'Habit Formation Guide'
          }
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
*/
