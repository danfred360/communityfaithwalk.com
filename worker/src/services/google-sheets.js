import { google } from 'googleapis';

export async function getAuthClient(env) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth.getClient();
}

export async function appendToRSVPSheet(env, data, ipAddress) {
  try {
    const authClient = await getAuthClient(env);
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const timestamp = new Date().toISOString();
    const values = [
      [
        timestamp,
        data.name,
        data.email,
        data.attendees,
        data.lunch ? 'Yes' : 'No',
        ipAddress || 'Unknown',
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: env.SPREADSHEET_ID,
      range: 'RSVPs!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to RSVP sheet:', error);
    throw new Error('Failed to save RSVP data');
  }
}

export async function appendToEmailSheet(env, email, ipAddress) {
  try {
    const authClient = await getAuthClient(env);
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const timestamp = new Date().toISOString();
    const values = [[timestamp, email, ipAddress || 'Unknown']];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: env.SPREADSHEET_ID,
      range: 'Email Signups!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to email sheet:', error);
    throw new Error('Failed to save email signup');
  }
}
