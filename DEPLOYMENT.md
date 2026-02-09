# Deployment Guide

This guide walks through deploying the Faith Walk website from scratch.

## Pre-requisites Checklist

- [ ] Domain `communityfaithwalk.com` configured with Cloudflare nameservers
- [ ] Google Cloud account (free tier)
- [ ] Cloudflare account (free tier)
- [ ] GitHub account
- [ ] Node.js 20+ installed locally
- [ ] Git installed locally

## Step 1: Google Sheets Setup (15 minutes)

### Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "Faith Walk"
4. Click "Create"
5. Wait for project creation, then select it
6. Go to "APIs & Services" → "Library"
7. Search for "Google Sheets API"
8. Click "Enable"
9. Go to "APIs & Services" → "Credentials"
10. Click "Create Credentials" → "Service Account"
11. Service account name: `faithwalk-api`
12. Click "Create and Continue"
13. Select role: "Editor"
14. Click "Done"
15. Click on the service account you just created
16. Go to "Keys" tab
17. Click "Add Key" → "Create new key"
18. Select "JSON"
19. Click "Create"
20. **Save the downloaded JSON file securely** (you'll need it later)

### Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it: "Faith Walk Event Data"
4. Create the first sheet (rename "Sheet1" to "RSVPs"):
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`
   - Column D: `Attendees`
   - Column E: `Lunch`
   - Column F: `IP Address`
5. Create the second sheet (click + to add, name it "Email Signups"):
   - Column A: `Timestamp`
   - Column B: `Email`
   - Column C: `IP Address`
6. Click "Share" button (top right)
7. Paste the service account email from the JSON file (looks like: `faithwalk-api@faith-walk-xxxxx.iam.gserviceaccount.com`)
8. Change permission to "Editor"
9. Uncheck "Notify people"
10. Click "Share"
11. **Copy the Spreadsheet ID** from the URL:
    - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
    - The ID is the long string between `/d/` and `/edit`

### Extract Credentials from JSON

Open the downloaded JSON file and note these values:
- `client_email`: The service account email
- `private_key`: The private key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

## Step 2: Push Code to GitHub (5 minutes)

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com/new)
   - Repository name: `communityfaithwalk.com`
   - Set to Public or Private (your choice)
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

2. Push code from your local machine:
   ```bash
   cd /Users/dpfrederick/code/personal/communityfaithwalk.com
   git add .
   git commit -m "Initial commit: Faith Walk website"
   git remote add origin https://github.com/YOUR_USERNAME/communityfaithwalk.com.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy Cloudflare Worker (10 minutes)

### Install and Setup Wrangler

1. Install Wrangler globally (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```
   This will open a browser window to authorize Wrangler.

### Configure Worker Secrets

```bash
cd /Users/dpfrederick/code/personal/communityfaithwalk.com/worker

# Set service account email
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
# When prompted, paste the client_email value from the JSON file

# Set private key
wrangler secret put GOOGLE_PRIVATE_KEY
# When prompted, paste the ENTIRE private_key value from the JSON file
# Include the "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" lines
# The key should include \n characters - paste it exactly as shown in the JSON

# Set spreadsheet ID
wrangler secret put SPREADSHEET_ID
# When prompted, paste the spreadsheet ID you copied earlier
```

### Deploy Worker

```bash
npm run deploy
```

You should see output like:
```
Total Upload: xx.xx KiB / gzip: xx.xx KiB
Uploaded faithwalk-api (x.xx sec)
Published faithwalk-api (x.xx sec)
  https://faithwalk-api.YOUR-SUBDOMAIN.workers.dev
```

### Configure Custom Route

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Click on "Workers & Pages"
4. Click on "faithwalk-api" worker
5. Go to "Settings" tab → "Triggers"
6. Under "Routes", click "Add route"
7. Route: `communityfaithwalk.com/api/*`
8. Zone: Select `communityfaithwalk.com`
9. Click "Add route"

## Step 4: Deploy Frontend to Cloudflare Pages (10 minutes)

### Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Click on "Workers & Pages"
4. Click "Create application"
5. Select "Pages" tab
6. Click "Connect to Git"
7. Authorize Cloudflare to access your GitHub account
8. Select the repository: `communityfaithwalk.com`
9. Click "Begin setup"

### Configure Build Settings

1. **Project name**: `communityfaithwalk` (or keep the default)
2. **Production branch**: `main`
3. **Build command**: `cd frontend && npm install && npm run build`
4. **Build output directory**: `frontend/dist`
5. **Root directory**: `/` (leave as default)
6. Click "Save and Deploy"

Wait for the build to complete (2-5 minutes).

### Add Custom Domain

1. After deployment completes, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter: `communityfaithwalk.com`
4. Click "Continue"
5. Cloudflare will automatically configure DNS
6. Wait for DNS propagation (usually 1-5 minutes, can take up to 24 hours)

## Step 5: Verification (5 minutes)

### Test the Worker API

```bash
curl -X POST https://communityfaithwalk.com/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "attendees": 2,
    "lunch": true
  }'
```

Expected response:
```json
{"success":true,"message":"RSVP submitted successfully"}
```

Check your Google Sheet - you should see a new row in the "RSVPs" sheet.

### Test the Website

1. Visit `https://communityfaithwalk.com` in your browser
2. Verify the page loads and displays correctly
3. Fill out the RSVP form and submit
4. Check Google Sheets for the new entry
5. Fill out the email signup form and submit
6. Check Google Sheets "Email Signups" sheet for the new entry

### Test Mobile Responsiveness

1. Open browser dev tools (F12)
2. Toggle device toolbar (mobile view)
3. Test different screen sizes
4. Verify forms work correctly on mobile

## Step 6: Final Configuration (Optional)

### Enable Email Notifications

To get notified when someone RSVPs:

1. Open your Google Sheet
2. Go to "Extensions" → "Apps Script"
3. Add this code:
   ```javascript
   function onEdit(e) {
     var sheet = e.source.getActiveSheet();
     if (sheet.getName() === "RSVPs") {
       var lastRow = sheet.getLastRow();
       var data = sheet.getRange(lastRow, 1, 1, 6).getValues()[0];

       MailApp.sendEmail({
         to: "your-email@example.com",
         subject: "New RSVP: " + data[1],
         body: "New RSVP received:\n\n" +
               "Name: " + data[1] + "\n" +
               "Email: " + data[2] + "\n" +
               "Attendees: " + data[3] + "\n" +
               "Lunch: " + data[4] + "\n" +
               "Time: " + data[0]
       });
     }
   }
   ```
4. Replace `your-email@example.com` with your email
5. Click "Save"
6. Click "Run" → Select "onEdit"
7. Authorize the script

Note: This will send an email for EVERY edit to the sheet, not just new RSVPs.

### Add Rate Limiting (Optional)

1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to "Security" → "WAF"
4. Create a rate limiting rule:
   - Path: `communityfaithwalk.com/api/*`
   - Requests: 10 per minute
   - Action: Block
   - Duration: 1 hour

## Troubleshooting

### Worker deployment fails
- Check that you're logged into Wrangler: `wrangler whoami`
- Verify your Cloudflare account has Workers enabled
- Check for syntax errors in worker code

### Secrets not working
- List secrets: `wrangler secret list`
- Re-set any missing secrets
- Verify the private key includes the full text with BEGIN/END markers

### Frontend not loading
- Check Cloudflare Pages deployment logs
- Verify build command is correct
- Check that `frontend/dist` directory exists after build

### Forms submitting but data not in sheets
- Verify spreadsheet is shared with service account email
- Check sheet names are exactly "RSVPs" and "Email Signups"
- View worker logs: `wrangler tail` (run in worker directory)
- Check Google Cloud Console for API errors

### CORS errors
- Verify worker route is configured: `communityfaithwalk.com/api/*`
- Check that `ALLOWED_ORIGIN` in worker matches your domain
- Clear browser cache

## Maintenance

### Update Event Information
1. Edit `frontend/src/components/EventInfo.jsx`
2. Commit and push to GitHub
3. Cloudflare Pages auto-deploys (1-2 minutes)

### Update Worker Logic
1. Edit files in `worker/src/`
2. Run `cd worker && npm run deploy`
3. Changes are live immediately

### View Data
- Open Google Sheet: "Faith Walk Event Data"
- Export as CSV for analysis
- Create pivot tables for reporting

## Costs

Everything runs on free tiers:
- **Cloudflare Pages**: Free (unlimited bandwidth)
- **Cloudflare Workers**: Free (up to 100,000 requests/day)
- **Google Sheets API**: Free (up to 100 requests per 100 seconds)

The site can handle thousands of RSVPs without any costs.

## Security Notes

- Never commit the Google service account JSON file to git
- Worker secrets are encrypted by Cloudflare
- HTTPS is enforced automatically
- CORS restricts API access to your domain
- IP addresses logged for spam prevention

## Success Checklist

- [ ] Google Sheet created and shared with service account
- [ ] Service account credentials obtained
- [ ] Code pushed to GitHub
- [ ] Worker deployed with secrets configured
- [ ] Worker route configured
- [ ] Frontend deployed to Cloudflare Pages
- [ ] Custom domain added and DNS propagated
- [ ] Test RSVP submitted successfully
- [ ] Test email signup submitted successfully
- [ ] Data appears in Google Sheets
- [ ] Mobile responsiveness verified

Congratulations! Your Faith Walk website is live!
