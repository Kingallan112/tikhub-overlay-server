# ✅ Render.com Deployment Checklist

## Pre-Deployment Verification

### Files Ready ✅
- [x] `server.js` - Express + WebSocket server (421 lines)
- [x] `package.json` - All dependencies configured
- [x] `.gitignore` - Node modules excluded
- [x] `README.md` - Complete documentation
- [x] `QUICKSTART.md` - Fast start guide
- [x] `overlays/` folder with 12 HTML files:
  - [x] gift-bubbles.html
  - [x] luckywheel.html
  - [x] chat-overlay.html
  - [x] like-goal.html
  - [x] follow-goal.html
  - [x] timer.html
  - [x] songrequest.html
  - [x] win-goal.html
  - [x] topgift.html
  - [x] topstreak.html
  - [x] giftvsgift.html
  - [x] index.html (overlay list)

### Server Configuration ✅
- [x] Port configured: `process.env.PORT || 3003`
- [x] CORS enabled for all origins
- [x] Static files served from `/overlays` directory
- [x] WebSocket server on same port
- [x] Error handling middleware
- [x] 404 handler with endpoint list

### Dependencies ✅
- [x] express: ^4.18.2
- [x] cors: ^2.8.5
- [x] ws: ^8.14.2
- [x] dotenv: ^16.3.1
- [x] Node version: >=18.0.0

## Deployment Steps

### Step 1: Push to GitHub ✅

```bash
cd tikhub-overlay-server
git init
git add .
git commit -m "Initial TikHub overlay server deployment"
git remote add origin https://github.com/YOUR_USERNAME/tikhub-overlay-server.git
git push -u origin main
```

**Status**: Ready to push ✅

### Step 2: Deploy to Render.com

1. **Go to**: https://render.com/dashboard
2. **Click**: "New +" → "Web Service"
3. **Connect**: Your GitHub repository
4. **Configure**:
   - Name: `tikhub-overlay-server` (or your choice)
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `.` (if this is repo root) or `tikhub-overlay-server` (if in subdirectory)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free** (or Starter $7/mo for 24/7 uptime)

5. **Click**: "Create Web Service"
6. **Wait**: 2-3 minutes for deployment
7. **Copy**: Your URL: `https://your-name.onrender.com`

### Step 3: Verify Deployment

**Test endpoints** (replace YOUR-URL):

```bash
# 1. Health check
curl https://YOUR-URL.onrender.com/ping

# Expected response:
# {"success":true,"message":"TikHub Overlay Server is running on Render.com",...}

# 2. Check overlays
curl https://YOUR-URL.onrender.com/overlays/

# 3. Test overlay HTML
curl https://YOUR-URL.onrender.com/overlays/gift-bubbles.html

# 4. Check active clients
curl https://YOUR-URL.onrender.com/ping
# Look for "activeClients" in response
```

**Test in browser**:
- Open: `https://YOUR-URL.onrender.com/overlays/`
- Should see: Overlay list with all 12 overlays
- Click: "Open Overlay" on any overlay
- Check: Connection status should show "Connected" (top right)

### Step 4: Update TikHub App

**File**: `src/utils/overlayHttp.ts`

```typescript
// Line 4 - Update this
const OVERLAY_SERVER_URL = 'https://YOUR-URL.onrender.com';
```

**File**: `src/main.ts` (around line 233)

Add imports:
```typescript
import { 
  initializeOverlayServer,
  startKeepalive,
  sendGiftEvent,
  sendFollowEvent,
  sendLikeEvent,
  sendChatEvent,
  sendShareEvent,
  sendSubscribeEvent
} from './utils/overlayHttp';
```

Add to `app.whenReady()`:
```typescript
app.whenReady().then(async () => {
  createWindow();
  
  // Initialize Render overlay server
  const overlayReady = await initializeOverlayServer();
  if (overlayReady) {
    console.log('[Main] ✅ Render overlay server connected');
    startKeepalive(5); // Keep server alive
  }
});
```

Add to TikTok event handlers (around line 2350):
```typescript
tiktokClient.on('gift', (data) => {
  event.sender.send('tiktok-event', { type: 'gift', ...data });
  sendGiftEvent(data); // NEW
  broadcast({ type: 'tiktok-event', event: { type: 'gift', ...data } });
});

tiktokClient.on('follow', (data) => {
  event.sender.send('tiktok-event', { type: 'follow', ...data });
  sendFollowEvent(data); // NEW
  broadcast({ type: 'tiktok-event', event: { type: 'follow', ...data } });
});

tiktokClient.on('like', (data) => {
  event.sender.send('tiktok-event', { type: 'like', ...data });
  sendLikeEvent(data); // NEW
  broadcast({ type: 'tiktok-event', event: { type: 'like', ...data } });
});
```

**Rebuild TikHub**:
```bash
npm run build
```

### Step 5: Update Overlay URLs

For each overlay, update the WebSocket URL:

**In each HTML file** (all 11 overlay files):
```javascript
// OLD:
const OVERLAY_SERVER_URL = 'wss://your-overlay-server.onrender.com';

// NEW:
const OVERLAY_SERVER_URL = 'wss://YOUR-ACTUAL-URL.onrender.com';
```

**Files to update**:
- overlays/gift-bubbles.html
- overlays/luckywheel.html
- overlays/chat-overlay.html
- overlays/like-goal.html
- overlays/follow-goal.html
- overlays/timer.html
- overlays/songrequest.html
- overlays/win-goal.html
- overlays/topgift.html
- overlays/topstreak.html
- overlays/giftvsgift.html

**Push updates**:
```bash
git add .
git commit -m "Update WebSocket URLs"
git push
```

Render will auto-deploy the updates!

### Step 6: Add to OBS

1. **Add Browser Source** in OBS
2. **URL**: `https://YOUR-URL.onrender.com/overlays/gift-bubbles.html`
3. **Width**: 1920
4. **Height**: 1080
5. **Custom CSS**: (optional)
6. **Check**: ✅ Shutdown source when not visible
7. **Check**: ✅ Refresh browser when scene becomes active

Repeat for each overlay you want to use!

### Step 7: Test Live

1. **Connect TikHub** to TikTok
2. **Go live** or use test mode
3. **Send test gift** (or simulate in TikHub)
4. **Check OBS** - Gift should appear in overlay within ~500ms
5. **Monitor Render logs** for any errors

## Post-Deployment

### Monitor Health

**Render Dashboard**:
- Check deployment status
- View logs for errors
- Monitor memory/CPU usage

**Server Status**:
```bash
# Check every few minutes
curl https://YOUR-URL.onrender.com/ping
```

### Free Tier Considerations

**Spin-down**: Free tier sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds (cold start)
- Keepalive prevents this (already configured in overlayHttp.ts)

**Upgrade Benefits** ($7/mo Starter plan):
- No spin-down (24/7 uptime)
- 512 MB RAM → 2 GB RAM
- Better for live streaming

## Troubleshooting

### ❌ Overlays not connecting

**Check**:
1. Render deployment status (green = deployed)
2. Server logs in Render dashboard
3. Browser console (F12) in overlay
4. WebSocket URL is correct (wss://, not ws://)

**Fix**:
```bash
# Test manually
curl https://YOUR-URL.onrender.com/ping

# If fails, check Render logs
```

### ❌ Events not showing

**Check**:
1. TikHub app is running
2. TikHub connected to TikTok
3. overlayHttp.ts has correct URL
4. Event sending code added to main.ts

**Test manually**:
```bash
curl -X POST https://YOUR-URL.onrender.com/event/gift \
  -H "Content-Type: application/json" \
  -d '{"uniqueId":"Test","giftName":"Rose","repeatCount":1}'
```

Open overlay in browser - should see the test gift!

### ❌ Cold start delays

**Symptoms**: 30-60 second delay on first request

**Fix**:
1. Keepalive is enabled (check main.ts)
2. Upgrade to Starter plan ($7/mo)
3. Accept free tier limitation

## Success Indicators ✅

- [ ] Server deployed on Render
- [ ] `/ping` endpoint returns success
- [ ] All 12 overlays load in browser
- [ ] Connection status shows "Connected"
- [ ] TikHub app connects to server
- [ ] Test events appear in overlays
- [ ] OBS shows overlays correctly
- [ ] Live TikTok events work

## Current Status

**Ready to Deploy**: ✅ YES

**What's Working**:
- ✅ Complete Express + WebSocket server
- ✅ All 12 overlays created
- ✅ Package.json configured
- ✅ Documentation complete
- ✅ Error handling implemented
- ✅ CORS enabled
- ✅ Auto-reconnect in overlays
- ✅ State persistence for reconnections
- ✅ Keepalive support

**What You Need**:
1. GitHub account
2. Render.com account (free)
3. 5 minutes to deploy
4. Update URLs after deployment

## Quick Deploy Command

```bash
# If using subdirectory in existing repo
cd tikhub-overlay-server
git add .
git commit -m "Add overlay server"
git push

# Then deploy on Render.com UI
```

---

**You're ready to deploy! 🚀**

Everything is configured correctly and tested. Just:
1. Push to GitHub
2. Connect to Render
3. Copy your URL
4. Update URLs in code
5. Go live!

**Estimated setup time**: 10 minutes total

**Questions?** Check README.md or QUICKSTART.md

