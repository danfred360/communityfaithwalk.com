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

function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
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

    let response;

    // Route to appropriate handler
    if (url.pathname === '/api/rsvp') {
      response = await handleRSVP(request, env);
    } else if (url.pathname === '/api/signup') {
      response = await handleEmailSignup(request, env);
    } else {
      response = new Response(
        JSON.stringify({ success: false, message: 'Not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Add CORS and security headers to response
    const headers = new Headers(response.headers);
    Object.entries(getCorsHeaders(corsOrigin)).forEach(([key, value]) => {
      headers.set(key, value);
    });
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
