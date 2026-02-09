const API_BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred. Please try again.',
    }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function submitRSVP(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('RSVP submission error:', error);
    throw error;
  }
}

export async function submitEmailSignup(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Email signup error:', error);
    throw error;
  }
}
