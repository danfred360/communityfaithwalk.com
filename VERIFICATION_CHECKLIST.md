# Verification Checklist

Use this checklist to verify the implementation is complete and working correctly.

## Pre-Deployment Verification

### Code Structure ✓
- [x] Frontend directory exists with all components
- [x] Worker directory exists with all handlers
- [x] Configuration files present (.gitignore, wrangler.toml, vite.config.js)
- [x] Documentation complete (README, DEPLOYMENT, LOCAL_DEVELOPMENT, etc.)

### Frontend Components ✓
- [x] App.jsx - Main component
- [x] EventInfo.jsx - Event details display
- [x] RSVPForm.jsx - RSVP form with validation
- [x] EmailSignup.jsx - Email signup form
- [x] api.js - API client utility
- [x] main.css - Responsive styles

### Worker Components ✓
- [x] index.js - Router and CORS handling
- [x] rsvp.js - RSVP handler with validation
- [x] email-signup.js - Email signup handler
- [x] google-sheets.js - Google Sheets integration

### Configuration ✓
- [x] package.json files created (root, frontend, worker)
- [x] wrangler.toml configured
- [x] vite.config.js configured
- [x] .gitignore configured
- [x] .env.example created

### Dependencies ✓
- [x] Frontend dependencies installed (React, Vite)
- [x] Worker dependencies installed (googleapis, wrangler)
- [x] Frontend builds successfully
- [x] No critical vulnerabilities

## Local Development Verification

### Frontend (Local)
- [ ] Frontend dev server starts (`npm run dev`)
- [ ] Page loads at http://localhost:5173
- [ ] Event information displays correctly
- [ ] RSVP form renders
- [ ] Email signup form renders
- [ ] Styles load correctly
- [ ] Responsive design works (test mobile view)
- [ ] No console errors

### Worker (Local)
- [ ] .dev.vars file created with credentials
- [ ] Worker dev server starts (`npm run dev`)
- [ ] Worker accessible at http://localhost:8787
- [ ] Test RSVP endpoint with curl (see below)
- [ ] Test email signup endpoint with curl
- [ ] Worker logs show no errors

### Integration (Local)
- [ ] Forms submit successfully
- [ ] Success messages display
- [ ] Error messages display for invalid input
- [ ] Data appears in Google Sheets "RSVPs" tab
- [ ] Data appears in Google Sheets "Email Signups" tab
- [ ] Timestamps are correct
- [ ] IP addresses are logged

### Test Commands

```bash
# Test RSVP (worker running)
curl -X POST http://localhost:8787/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","attendees":2,"lunch":true}'

# Expected: {"success":true,"message":"RSVP submitted successfully"}

# Test Email Signup (worker running)
curl -X POST http://localhost:8787/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected: {"success":true,"message":"Email signup successful"}
```

## Deployment Verification

### Google Sheets Setup
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Service account JSON key downloaded
- [ ] Google Sheet created: "Faith Walk Event Data"
- [ ] Sheet 1 named "RSVPs" with columns: Timestamp | Name | Email | Attendees | Lunch | IP Address
- [ ] Sheet 2 named "Email Signups" with columns: Timestamp | Email | IP Address
- [ ] Sheet shared with service account email
- [ ] Service account has Editor access
- [ ] Spreadsheet ID copied

### GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Repository accessible

### Cloudflare Worker Setup
- [ ] Wrangler CLI installed
- [ ] Logged into Cloudflare (`wrangler login`)
- [ ] GOOGLE_SERVICE_ACCOUNT_EMAIL secret set
- [ ] GOOGLE_PRIVATE_KEY secret set
- [ ] SPREADSHEET_ID secret set
- [ ] Secrets verified (`wrangler secret list`)
- [ ] Worker deployed (`npm run deploy`)
- [ ] Worker shows in Cloudflare dashboard
- [ ] Custom route configured: `communityfaithwalk.com/api/*`

### Cloudflare Pages Setup
- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured:
  - Build command: `cd frontend && npm install && npm run build`
  - Build output: `frontend/dist`
  - Root directory: `/`
- [ ] Initial build completed successfully
- [ ] Custom domain added: `communityfaithwalk.com`
- [ ] DNS configured (automatic)
- [ ] SSL certificate issued (automatic)

## Production Verification

### Site Accessibility
- [ ] https://communityfaithwalk.com loads
- [ ] HTTPS works (green padlock)
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] All images/assets load

### Functionality Testing
- [ ] Event information displays correctly
- [ ] RSVP form is visible and functional
- [ ] Email signup form is visible and functional

### RSVP Form Testing
- [ ] Submit with valid data succeeds
- [ ] Success message displays
- [ ] Data appears in Google Sheets "RSVPs"
- [ ] Timestamp is correct
- [ ] All fields populated correctly
- [ ] Lunch preference saved correctly

### RSVP Form Validation
- [ ] Submit empty form shows error
- [ ] Submit with invalid email shows error
- [ ] Submit with 0 attendees shows error
- [ ] Submit with negative attendees shows error
- [ ] Error messages are clear and helpful

### Email Signup Testing
- [ ] Submit with valid email succeeds
- [ ] Success message displays
- [ ] Data appears in Google Sheets "Email Signups"
- [ ] Timestamp is correct

### Email Signup Validation
- [ ] Submit empty form shows error
- [ ] Submit with invalid email shows error
- [ ] Error messages are clear

### Mobile Testing
- [ ] Open site on mobile device (or browser dev tools mobile view)
- [ ] Page layout responsive
- [ ] Forms work on touch screens
- [ ] Buttons are large enough to tap
- [ ] Text is readable without zooming
- [ ] Forms submit successfully

### Cross-Browser Testing
- [ ] Chrome/Edge - works
- [ ] Firefox - works
- [ ] Safari - works
- [ ] Mobile Safari - works
- [ ] Mobile Chrome - works

### Performance Testing
- [ ] PageSpeed Insights score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Forms respond quickly (< 1s)

### Security Testing
- [ ] HTTPS enforced (http redirects to https)
- [ ] CORS configured correctly
- [ ] No secrets in frontend code
- [ ] API rejects invalid methods (GET, PUT, DELETE)
- [ ] API rejects malformed JSON
- [ ] API validates all inputs
- [ ] XSS prevention (inputs sanitized)

### Data Integrity
- [ ] Submit 3 test RSVPs
- [ ] All 3 appear in Google Sheets
- [ ] Data is accurate
- [ ] No duplicate entries
- [ ] Timestamps are sequential

### Error Handling
- [ ] Submit form with missing name → error message
- [ ] Submit form with missing email → error message
- [ ] Submit form with invalid email → error message
- [ ] Temporarily break Google Sheets access → graceful error
- [ ] Network error during submit → graceful error

## Post-Deployment Tasks

### Clean Up Test Data
- [ ] Remove test submissions from Google Sheets
- [ ] Verify real submissions still work

### Monitoring Setup
- [ ] Cloudflare Analytics accessible
- [ ] Worker metrics accessible
- [ ] Google Sheets accessible to organizers

### Documentation Verification
- [ ] README.md is accurate
- [ ] DEPLOYMENT.md matches actual deployment
- [ ] LOCAL_DEVELOPMENT.md instructions work
- [ ] QUICK_REFERENCE.md is helpful

### Communication
- [ ] Share website URL with organizers
- [ ] Share Google Sheets link with organizers
- [ ] Provide instructions for viewing data
- [ ] Document how to update event information

## Ongoing Monitoring

### Daily (During Event Registration Period)
- [ ] Check Google Sheets for new submissions
- [ ] Monitor for spam/abuse
- [ ] Respond to user issues

### Weekly
- [ ] Check Cloudflare Analytics
- [ ] Review Worker error logs
- [ ] Verify site is accessible
- [ ] Check disk quotas (should be n/a)

### Monthly
- [ ] Review submission data
- [ ] Check for security updates
- [ ] Verify backups exist

## Success Criteria

The implementation is successful if ALL of these are true:

- [x] Code is complete and builds successfully
- [ ] Local development works
- [ ] Deployed to Cloudflare (Pages + Workers)
- [ ] Forms submit and save to Google Sheets
- [ ] Mobile responsive
- [ ] No console errors
- [ ] HTTPS working
- [ ] Fast performance (< 3s load)
- [ ] All documentation complete
- [ ] Organizers can access data

## Troubleshooting Reference

### If forms don't submit:
1. Check browser console for errors
2. Verify worker is deployed: `wrangler deployments list`
3. Check worker logs: `wrangler tail`
4. Test worker directly with curl

### If data doesn't appear in sheets:
1. Verify sheet names match exactly: "RSVPs" and "Email Signups"
2. Verify sheet is shared with service account
3. Check spreadsheet ID in worker secrets
4. Check worker logs for Google API errors

### If site doesn't load:
1. Check DNS propagation: https://dnschecker.org/
2. Verify Cloudflare Pages deployment status
3. Check for build errors in Pages dashboard
4. Verify domain is added to Pages project

### If CORS errors:
1. Verify worker route is configured
2. Check ALLOWED_ORIGIN in wrangler.toml
3. Clear browser cache
4. Test in incognito/private window

## Sign-Off

### Implementation Complete
- **Date**: _________________
- **Verified by**: _________________
- **Notes**: _________________

### Deployment Complete
- **Date**: _________________
- **Deployed by**: _________________
- **Production URL**: https://communityfaithwalk.com
- **Notes**: _________________

### Ready for Production
- [ ] All verification checks passed
- [ ] Test data cleaned up
- [ ] Monitoring set up
- [ ] Documentation shared with team
- [ ] Website announced to community

---

**Keep this checklist for future reference and annual updates!**
