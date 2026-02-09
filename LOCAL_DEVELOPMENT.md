# Local Development Guide

This guide explains how to run the Faith Walk website locally for development and testing.

## Prerequisites

- Node.js 20+ installed
- Google Sheets already set up (see DEPLOYMENT.md)
- Service account credentials JSON file

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install worker dependencies
cd ../worker
npm install
```

### 2. Configure Worker Environment

Create a `.dev.vars` file in the `worker` directory:

```bash
cd worker
touch .dev.vars
```

Edit `worker/.dev.vars` and add your credentials:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=your-spreadsheet-id-here
ALLOWED_ORIGIN=http://localhost:5173
```

**Important**: Get these values from your Google service account JSON file:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The `client_email` field
- `GOOGLE_PRIVATE_KEY`: The `private_key` field (copy exactly, including the newlines as `\n`)
- `SPREADSHEET_ID`: From your Google Sheets URL

### 3. Start Development Servers

Open two terminal windows:

**Terminal 1 - Start Worker:**
```bash
cd worker
npm run dev
```

The worker will be available at `http://localhost:8787`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Open Browser

Visit `http://localhost:5173` in your browser.

## How It Works

The frontend development server (Vite) proxies API requests to the worker running at `http://localhost:8787`. This is configured in the API client to use relative URLs (`/api/rsvp`, `/api/signup`), which work both locally and in production.

When you submit a form:
1. Frontend sends request to `/api/rsvp` or `/api/signup`
2. Request goes to worker at `http://localhost:8787/api/*`
3. Worker validates data and saves to Google Sheets
4. Response is returned to frontend

## Testing Forms

### Test RSVP Submission

1. Fill out the RSVP form
2. Click "Submit RSVP"
3. Check your Google Sheet - a new row should appear in "RSVPs"

### Test Email Signup

1. Fill out the email signup form
2. Click "Sign Up for Updates"
3. Check your Google Sheet - a new row should appear in "Email Signups"

### Test Validation

Try submitting forms with:
- Empty fields (should show error)
- Invalid email format (should show error)
- Valid data (should succeed)

## Development Tips

### Hot Reload

Both servers support hot reload:
- **Frontend**: Changes to React components instantly reflect
- **Worker**: Code changes require the worker to restart (automatic)

### Viewing Worker Logs

The worker terminal shows console.log output and errors in real-time.

### Testing Error Cases

To test error handling, temporarily modify the worker to throw errors:

```javascript
// In worker/src/handlers/rsvp.js
export async function handleRSVP(request, env) {
  throw new Error('Test error');
  // ... rest of function
}
```

### Testing Different Screen Sizes

Use browser dev tools (F12) to test responsive design:
1. Open dev tools
2. Click the device toolbar icon (or Ctrl+Shift+M)
3. Select different devices or custom dimensions

## Common Issues

### Port Already in Use

If port 8787 or 5173 is already in use:

```bash
# Find process using port
lsof -i :8787
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Worker Can't Connect to Google Sheets

Check that:
- `.dev.vars` file exists in `worker` directory
- Service account email is correct
- Private key is formatted correctly (with `\n` for newlines)
- Spreadsheet is shared with service account email
- Google Sheets API is enabled in Google Cloud Console

### CORS Errors

The worker is configured to allow requests from `http://localhost:5173`. If you change the frontend port, update `ALLOWED_ORIGIN` in `worker/.dev.vars`.

### Forms Submit but No Data in Sheets

Check the worker terminal for errors. Common causes:
- Sheet names don't match exactly ("RSVPs" and "Email Signups")
- Spreadsheet ID is incorrect
- Service account doesn't have edit access to the sheet

## Project Structure

```
frontend/
  src/
    components/
      EventInfo.jsx          # Event details display
      RSVPForm.jsx          # RSVP form with validation
      EmailSignup.jsx       # Email signup form
    utils/
      api.js               # API client functions
    styles/
      main.css            # All CSS styles
    App.jsx              # Main app component
    main.jsx            # React entry point

worker/
  src/
    handlers/
      rsvp.js                # RSVP endpoint handler
      email-signup.js        # Email signup handler
    services/
      google-sheets.js       # Google Sheets integration
    index.js                 # Worker entry & routing
```

## Making Changes

### Update Event Information

Edit `frontend/src/components/EventInfo.jsx`:
```jsx
<div className="info-item">
  <strong>Date:</strong>
  <span>Saturday, June 14, 2026</span>  // Change this
</div>
```

Changes appear immediately in the browser.

### Update Form Fields

Edit `frontend/src/components/RSVPForm.jsx` to add/remove fields.

Remember to also update:
1. `worker/src/handlers/rsvp.js` - validation logic
2. `worker/src/services/google-sheets.js` - data mapping
3. Google Sheet columns

### Update Styling

Edit `frontend/src/styles/main.css`. Changes appear immediately.

### Update API Logic

Edit files in `worker/src/handlers/` or `worker/src/services/`. The worker automatically restarts.

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`.

### Test Production Build Locally

```bash
cd frontend
npm run preview
```

Serves the production build at `http://localhost:4173`.

### Deploy Worker

```bash
cd worker
npm run deploy
```

Deploys to Cloudflare Workers.

## Environment Variables

### Local Development (`.dev.vars`)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=abc123...
ALLOWED_ORIGIN=http://localhost:5173
```

### Production (Cloudflare Secrets)

Set via Wrangler CLI:
```bash
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY
wrangler secret put SPREADSHEET_ID
```

`ALLOWED_ORIGIN` is set in `wrangler.toml` as a var.

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/update-event-info

# Make changes
# ...

# Commit
git add .
git commit -m "Update event date"

# Push
git push origin feature/update-event-info

# Merge to main via GitHub PR or:
git checkout main
git merge feature/update-event-info
git push origin main
```

## VS Code Recommended Extensions

- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- Cloudflare Workers

## Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Worker
npm run dev          # Start local worker
npm run deploy       # Deploy to Cloudflare

# Root (convenience commands)
npm run dev:frontend      # Start frontend
npm run dev:worker        # Start worker
npm run build:frontend    # Build frontend
npm run deploy:worker     # Deploy worker
```

## Next Steps

- Read [README.md](README.md) for project overview
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize event information in `EventInfo.jsx`
- Test all features locally before deploying

## Getting Help

If you encounter issues:
1. Check the terminal output for errors
2. Check browser console for frontend errors
3. Check worker terminal for API errors
4. Verify `.dev.vars` is configured correctly
5. Verify Google Sheet is accessible

Happy coding!
