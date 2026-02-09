# Community Faith Walk Website

A simple, elegant website for the annual Faith Walk event. Built with React and Cloudflare Workers, storing data in Google Sheets.

## Features

- Event information display
- RSVP form with attendee count and lunch preferences
- Email signup for event updates
- Data stored in Google Sheets for easy organizer access
- Fully responsive mobile-friendly design
- Hosted on Cloudflare Pages (free tier)

## Project Structure

```
communityfaithwalk.com/
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # API client
│   │   └── styles/        # CSS styles
│   └── package.json
└── worker/                # Cloudflare Worker API
    ├── src/
    │   ├── handlers/      # Request handlers
    │   └── services/      # Google Sheets integration
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- Google Cloud account (free tier)
- Cloudflare account (free tier)
- GitHub account

### 1. Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Faith Walk"
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "faithwalk-api")
   - Grant it the "Editor" role
   - Click "Done"
5. Create a JSON key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download and save securely
6. Create a Google Sheet:
   - Go to [Google Sheets](https://sheets.google.com/)
   - Create a new spreadsheet: "Faith Walk Event Data"
   - Create two sheets:
     - **RSVPs**: Columns: `Timestamp | Name | Email | Attendees | Lunch | IP Address`
     - **Email Signups**: Columns: `Timestamp | Email | IP Address`
   - Share the sheet with the service account email (found in the JSON key file)
     - Give it "Editor" access
7. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 2. Cloudflare Worker Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Set up Worker secrets (from the worker directory):
   ```bash
   cd worker

   # Set the service account email
   wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
   # Paste the email from the JSON key file

   # Set the private key
   wrangler secret put GOOGLE_PRIVATE_KEY
   # Paste the entire private key from the JSON key file (including BEGIN/END lines)

   # Set the spreadsheet ID
   wrangler secret put SPREADSHEET_ID
   # Paste the spreadsheet ID from step 1.7
   ```

4. Deploy the worker:
   ```bash
   npm run deploy
   ```

5. Configure the custom route:
   - Go to Cloudflare Dashboard > Workers & Pages
   - Click on your worker (`faithwalk-api`)
   - Go to Settings > Triggers
   - Add a route: `communityfaithwalk.com/api/*`
   - Select the zone (your domain)

### 3. Cloudflare Pages Setup

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/communityfaithwalk.com.git
   git push -u origin main
   ```

2. Connect to Cloudflare Pages:
   - Go to Cloudflare Dashboard > Workers & Pages
   - Click "Create application" > "Pages"
   - Connect to Git > Select your repository
   - Configure build settings:
     - **Build command**: `cd frontend && npm install && npm run build`
     - **Build output directory**: `frontend/dist`
     - **Root directory**: `/`
   - Click "Save and Deploy"

3. Add custom domain:
   - Go to your Pages project > Custom domains
   - Add `communityfaithwalk.com`
   - Cloudflare will automatically configure DNS

## Local Development

### Frontend Development

```bash
# Install dependencies
cd frontend
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### Worker Development

```bash
# Install dependencies
cd worker
npm install

# Start local worker (http://localhost:8787)
npm run dev
```

Note: For local worker development, you'll need to create a `.dev.vars` file in the worker directory with your secrets:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=your-spreadsheet-id
ALLOWED_ORIGIN=http://localhost:5173
```

### Testing the Full Stack Locally

1. Start the worker in one terminal:
   ```bash
   cd worker && npm run dev
   ```

2. Update the API base URL in `frontend/src/utils/api.js` temporarily:
   ```javascript
   const API_BASE_URL = 'http://localhost:8787/api';
   ```

3. Start the frontend in another terminal:
   ```bash
   cd frontend && npm run dev
   ```

4. Visit http://localhost:5173

**Important**: Remember to revert the API URL change before deploying!

## Updating Event Information

To update event details (date, time, location, description):

1. Edit `frontend/src/components/EventInfo.jsx`
2. Update the relevant information
3. Commit and push to GitHub:
   ```bash
   git add frontend/src/components/EventInfo.jsx
   git commit -m "Update event information"
   git push
   ```
4. Cloudflare Pages will automatically rebuild and deploy (1-2 minutes)

## Viewing Submissions

All form submissions are stored in your Google Sheet: "Faith Walk Event Data"

- **RSVPs**: View the "RSVPs" sheet for all RSVP submissions
- **Email Signups**: View the "Email Signups" sheet for all email signups

You can download as CSV, create pivot tables, or share with other organizers.

## Architecture

**Frontend**:
- Vite + React (minimal dependencies)
- Static site with custom CSS
- Hosted on Cloudflare Pages

**Backend**:
- Cloudflare Workers for API endpoints
- Google Sheets API for data persistence
- Serverless, scales automatically

**Benefits**:
- Zero backend costs (free tiers)
- Global CDN for fast loading
- Automatic SSL/HTTPS
- No database maintenance
- Easy data access via Google Sheets

## Deployment

### Frontend
Automatic deployment via Cloudflare Pages when you push to GitHub.

### Worker
Manual deployment (one command):
```bash
cd worker
npm run deploy
```

## Troubleshooting

### Forms not submitting
1. Check browser console for errors
2. Verify worker is deployed: `wrangler deployments list`
3. Check worker logs: `wrangler tail`
4. Verify secrets are set: `wrangler secret list`

### Data not appearing in Google Sheets
1. Verify the spreadsheet is shared with the service account email
2. Check that sheet names match exactly: "RSVPs" and "Email Signups"
3. Verify the spreadsheet ID in worker secrets
4. Check worker logs for Google API errors

### CORS errors
1. Verify `ALLOWED_ORIGIN` in `wrangler.toml` matches your domain
2. Check that the worker route is configured correctly
3. Ensure the API requests use the same domain as the site

## Security

- Google Sheets credentials stored as Cloudflare Worker secrets (encrypted)
- CORS restricted to the production domain
- Input validation on both client and server
- IP addresses logged for spam prevention
- HTTPS enforced via Cloudflare

## License

MIT

## Support

For issues or questions, contact the church administrator.
