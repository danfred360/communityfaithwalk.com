# Quick Reference Card

## Common Commands

### Development
```bash
# Start frontend dev server (http://localhost:5173)
cd frontend && npm run dev

# Start worker dev server (http://localhost:8787)
cd worker && npm run dev

# Build frontend for production
cd frontend && npm run build
```

### Deployment
```bash
# Deploy worker to Cloudflare
cd worker && npm run deploy

# Frontend auto-deploys via Cloudflare Pages when pushed to GitHub
git push origin main
```

### Secrets Management
```bash
# Set worker secrets (in worker directory)
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY
wrangler secret put SPREADSHEET_ID

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete SECRET_NAME
```

### Worker Management
```bash
# View worker logs (real-time)
cd worker && wrangler tail

# List deployments
wrangler deployments list

# View worker info
wrangler whoami
```

## File Locations

### Update Event Information
```
frontend/src/components/EventInfo.jsx
```

### Update Styles
```
frontend/src/styles/main.css
```

### Update RSVP Form
```
frontend/src/components/RSVPForm.jsx
worker/src/handlers/rsvp.js
```

### Update Email Signup
```
frontend/src/components/EmailSignup.jsx
worker/src/handlers/email-signup.js
```

### Worker Configuration
```
worker/wrangler.toml
```

## Important URLs

### Local Development
- Frontend: `http://localhost:5173`
- Worker: `http://localhost:8787`

### Production
- Website: `https://communityfaithwalk.com`
- API: `https://communityfaithwalk.com/api/*`
- Worker Dashboard: `https://dash.cloudflare.com/`
- Google Sheet: (check your Google Drive)

## Google Sheets

### RSVP Sheet Columns
```
Timestamp | Name | Email | Attendees | Lunch | IP Address
```

### Email Signups Sheet Columns
```
Timestamp | Email | IP Address
```

## Environment Variables

### Local (.dev.vars in worker directory)
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=...
ALLOWED_ORIGIN=http://localhost:5173
```

### Production (Cloudflare Secrets)
```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
SPREADSHEET_ID
```

Note: `ALLOWED_ORIGIN` is set in `wrangler.toml` for production

## Troubleshooting

### Forms not working
1. Check browser console (F12)
2. Check worker logs: `cd worker && wrangler tail`
3. Verify secrets: `wrangler secret list`

### Data not in Google Sheets
1. Verify sheet is shared with service account email
2. Check sheet names: "RSVPs" and "Email Signups"
3. Verify spreadsheet ID is correct
4. Check worker logs for errors

### CORS errors
1. Verify worker route: `communityfaithwalk.com/api/*`
2. Check `ALLOWED_ORIGIN` in `wrangler.toml`
3. Clear browser cache

### Build fails
1. Check Node.js version: `node --version` (need 20+)
2. Clear dependencies: `rm -rf node_modules && npm install`
3. Check for syntax errors

## Quick Tests

### Test Worker Endpoint
```bash
curl -X POST https://communityfaithwalk.com/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","attendees":2,"lunch":true}'
```

Expected response:
```json
{"success":true,"message":"RSVP submitted successfully"}
```

### Test Local Worker
```bash
curl -X POST http://localhost:8787/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","attendees":2,"lunch":true}'
```

## Git Workflow

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push (triggers auto-deploy)
git push origin main

# Create branch
git checkout -b feature/my-feature

# Merge branch
git checkout main
git merge feature/my-feature
```

## CSS Variables (colors)

Edit these in `frontend/src/styles/main.css`:

```css
--primary-color: #2c5f8d;     /* Main brand color */
--secondary-color: #5d9b9b;   /* Secondary brand color */
--accent-color: #d4a574;      /* Accent color */
--error-color: #d32f2f;       /* Error messages */
--success-color: #388e3c;     /* Success messages */
```

## Support Contacts

### Services Used
- **Cloudflare**: https://dash.cloudflare.com/
- **Google Cloud**: https://console.cloud.google.com/
- **Google Sheets**: https://sheets.google.com/
- **GitHub**: https://github.com/

### Documentation
- README.md - Project overview
- DEPLOYMENT.md - Full deployment guide
- LOCAL_DEVELOPMENT.md - Local dev guide
- PROJECT_SUMMARY.md - Implementation summary

## Emergency Procedures

### Site is down
1. Check Cloudflare status: https://www.cloudflarestatus.com/
2. Check Pages deployment: Cloudflare Dashboard → Pages
3. Check worker: Cloudflare Dashboard → Workers
4. View logs: `cd worker && wrangler tail`

### Forms not submitting
1. Test worker directly with curl (see "Quick Tests" above)
2. If worker works, issue is frontend - check browser console
3. If worker fails, check worker logs
4. Verify Google Sheets API is working

### Need to rollback
1. Cloudflare Pages: Redeploy previous version in dashboard
2. Worker: Deploy previous code with `wrangler deploy`
3. Git: `git revert HEAD` then `git push`

## Performance

### Expected Load Times
- Initial page load: < 2 seconds
- Form submission: < 1 second
- Mobile load: < 3 seconds

### Capacity
- Frontend: Unlimited (CDN)
- Worker: 100,000 requests/day (free tier)
- Google Sheets: 100 requests per 100 seconds

Site can handle thousands of RSVPs without issues.

## Monitoring

### Check Site Status
```bash
curl -I https://communityfaithwalk.com
```

Should return `HTTP/2 200`

### View Cloudflare Analytics
Cloudflare Dashboard → Analytics
- Page views
- Requests
- Bandwidth
- Top countries

### View Worker Analytics
Cloudflare Dashboard → Workers → faithwalk-api → Metrics
- Request count
- Success rate
- Errors
- Duration

### View Google Sheets Data
Just open the spreadsheet in Google Sheets!

## Backup

### Code Backup
Code is backed up in GitHub automatically.

### Data Backup
Google Sheets data:
1. Open spreadsheet
2. File → Download → CSV (for each sheet)
3. Save locally

Recommended: Set up automatic weekly backups via Google Apps Script.

## Annual Maintenance

Before next year's event:

1. Update event information in `EventInfo.jsx`
2. Clear previous year's data in Google Sheets (or create new sheet)
3. Test forms still work
4. Update copyright year in footer
5. Deploy changes

Time required: 15-30 minutes

---

**Print this page for quick reference!**
