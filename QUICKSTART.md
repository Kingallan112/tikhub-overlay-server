# Quick Start - 2 Minutes Setup

## Deploy to Render.com (60 seconds)

1. **Go to** [render.com](https://render.com)
2. **Click** "New +" → "Web Service"
3. **Connect** this GitHub repo
4. **Set** Root Directory: `tikhub-overlay-server`
5. **Deploy** (auto-detects settings from package.json)
6. **Copy** your URL: `https://xxxxx.onrender.com`

## Update TikHub (60 seconds)

1. **Edit** `src/utils/overlayHttp.ts` line 4:
   ```typescript
   const OVERLAY_SERVER_URL = 'https://YOUR-URL.onrender.com';
   ```

2. **Add** to `src/main.ts` (after line 233):
   ```typescript
   import { initializeOverlayServer, startKeepalive } from './utils/overlayHttp';
   
   // In app.whenReady():
   const overlayReady = await initializeOverlayServer();
   if (overlayReady) startKeepalive(5);
   ```

3. **Add** event forwarding to TikTok handlers (after line 2348):
   ```typescript
   import { sendGiftEvent, sendFollowEvent, sendLikeEvent } from './utils/overlayHttp';
   
   tiktokClient.on('gift', (data) => {
     event.sender.send('tiktok-event', { type: 'gift', ...data });
     sendGiftEvent(data); // NEW: Send to Render
   });
   
   tiktokClient.on('follow', (data) => {
     event.sender.send('tiktok-event', { type: 'follow', ...data });
     sendFollowEvent(data); // NEW: Send to Render
   });
   
   tiktokClient.on('like', (data) => {
     event.sender.send('tiktok-event', { type: 'like', ...data });
     sendLikeEvent(data); // NEW: Send to Render
   });
   ```

4. **Rebuild:** `npm run build`

## Test (30 seconds)

```bash
# Test server
curl https://YOUR-URL.onrender.com/ping

# Test overlay
# Open in browser: https://YOUR-URL.onrender.com/gift-bubbles.html
# Should see "Connected" in top right
```

## Add to OBS

1. Add **Browser Source**
2. URL: `https://YOUR-URL.onrender.com/gift-bubbles.html`
3. Size: 1920 x 1080

## Done! 🎉

Go live on TikTok and receive a gift - should appear in overlay!

---

**Need help?** See full guide: `RENDER_OVERLAY_INTEGRATION_GUIDE.md`

