
// /api/subscribe-simple/route.js

import { NextResponse } from 'next/server';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Subscribe to Mailchimp with specific tag for automation
    const mailchimpResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['habit-guide-pdf'], // This tag triggers the automation
          merge_fields: {
            SOURCE: 'Habit Formation Guide',
            SIGNUP_DATE: new Date().toISOString().split('T')[0],
            FNAME: '', // You can add name field to form if wanted
          }
        }),
      }
    );

    const mailchimpData = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      // Handle specific errors
      if (mailchimpData.title === 'Member Exists') {
        // User already subscribed - trigger automation anyway
        // You might want to add them to the tag
        await addTagToExistingMember(email, 'habit-guide-pdf');
        return NextResponse.json({ 
          success: true, 
          message: 'Guide is being sent to your email!' 
        });
      }
      
      console.error('Mailchimp error:', mailchimpData);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email.' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to add tag to existing member
async function addTagToExistingMember(email, tag) {
  try {
    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${email}/tags`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: [
            {
              name: tag,
              status: 'active'
            }
          ]
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error adding tag:', error);
    return false;
  }
}

