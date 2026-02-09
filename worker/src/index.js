import { handleRSVP } from './handlers/rsvp.js';
import { handleEmailSignup } from './handlers/email-signup.js';

function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Get origin for CORS
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://communityfaithwalk.com';
    const corsOrigin = origin === allowedOrigin || origin === 'http://localhost:5173'
      ? origin
      : allowedOrigin;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(corsOrigin),
      });
    }

    // Allow GET for test endpoint, POST for others
    const isTestEndpoint = url.pathname === '/api/test';
    if (!isTestEndpoint && request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(corsOrigin),
          },
        }
      );
    }

    let response;

    // Route to appropriate handler
    if (url.pathname === '/api/rsvp') {
      response = await handleRSVP(request, env);
    } else if (url.pathname === '/api/signup') {
      response = await handleEmailSignup(request, env);
    } else if (url.pathname === '/api/test') {
      // Test endpoint to verify secrets are configured
      response = new Response(
        JSON.stringify({
          success: true,
          configured: {
            email: !!env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            privateKey: !!env.GOOGLE_PRIVATE_KEY,
            spreadsheetId: !!env.SPREADSHEET_ID,
            privateKeyLength: env.GOOGLE_PRIVATE_KEY ? env.GOOGLE_PRIVATE_KEY.length : 0,
            privateKeyStart: env.GOOGLE_PRIVATE_KEY ? env.GOOGLE_PRIVATE_KEY.substring(0, 30) : 'N/A',
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      response = new Response(
        JSON.stringify({ success: false, message: 'Not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Add CORS headers to response
    const headers = new Headers(response.headers);
    Object.entries(getCorsHeaders(corsOrigin)).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
