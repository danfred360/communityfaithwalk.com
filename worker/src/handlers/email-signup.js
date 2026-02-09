import { appendToEmailSheet } from '../services/google-sheets-fetch.js';

export async function handleEmailSignup(request, env) {
  try {
    const body = await request.json();

    // Validate required field
    if (!body.email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email address is required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email format'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get IP address from request
    const ipAddress = request.headers.get('CF-Connecting-IP') ||
                     request.headers.get('X-Forwarded-For') ||
                     'Unknown';

    const email = body.email.trim().toLowerCase();

    // Save to Google Sheets
    await appendToEmailSheet(env, email, ipAddress);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email signup successful'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Email signup handler error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while signing up. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
