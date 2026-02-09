import { appendToRSVPSheet } from '../services/google-sheets-fetch.js';

export async function handleRSVP(request, env) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.attendees) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields: name, email, and attendees are required'
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

    // Validate attendees is a positive number
    const attendees = parseInt(body.attendees);
    if (isNaN(attendees) || attendees < 1 || attendees > 100) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Number of attendees must be between 1 and 100'
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

    // Prepare data for sheet
    const rsvpData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      attendees: attendees,
      lunch: Boolean(body.lunch),
    };

    // Save to Google Sheets
    await appendToRSVPSheet(env, rsvpData, ipAddress);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'RSVP submitted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('RSVP handler error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while processing your RSVP. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
