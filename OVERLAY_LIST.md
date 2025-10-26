# Complete Overlay List

## 📋 All Available Overlays (11 Total)

### 1. 🎁 Gift Bubbles (`gift-bubbles.html`)
- **Purpose**: Floating gift animations
- **WebSocket**: `/ws/gift-bubbles`
- **Events**: Gift events from TikTok
- **Features**: 
  - Animated bubbles rising up screen
  - Displays username, gift name, repeat count
  - Mega gift animations for high-value gifts
  - Random horizontal positioning

### 2. 🎡 Lucky Wheel (`luckywheel.html`)
- **Purpose**: Spinning wheel with prizes
- **WebSocket**: `/ws/luckywheel`
- **Events**: Wheel config, spin commands
- **Features**:
  - Configurable segments with colors
  - Smooth spinning animation
  - Winner announcement popup
  - 4-second spin duration

### 3. 💬 Chat Overlay (`chat-overlay.html`)
- **Purpose**: Live chat messages
- **WebSocket**: `/ws/chat`
- **Events**: Chat, gifts, follows, likes
- **Features**:
  - Auto-scrolling messages
  - Color-coded by event type
  - 15-second message lifetime
  - Max 10 messages visible

### 4. 👍 Like Goal (`like-goal.html`)
- **Purpose**: Like counter with progress bar
- **WebSocket**: `/ws/like-goal`
- **Events**: Like goal updates, like events
- **Features**:
  - Current/goal counter display
  - Animated progress bar
  - Percentage display
  - Celebration animation on goal reach

### 5. ❤️ Follow Goal (`follow-goal.html`)
- **Purpose**: Follower goal tracker
- **WebSocket**: `/ws/follow-goal`
- **Events**: Follow goal updates, follow events
- **Features**:
  - Current/goal follower count
  - Pink-themed progress bar
  - Real-time updates
  - Auto-increment on new follows

### 6. ⏱️ Timer (`timer.html`)
- **Purpose**: Countdown timer
- **WebSocket**: `/ws/timer`
- **Events**: Timer start, stop, update
- **Features**:
  - Large digital display (MM:SS)
  - Warning animation under 60 seconds
  - Red pulsing for urgency
  - Monospace font for clarity

### 7. 🎵 Song Requests (`songrequest.html`)
- **Purpose**: Spotify integration overlay
- **WebSocket**: `/ws/songrequests`
- **Events**: Current track, queue updates
- **Features**:
  - Now playing with album art
  - Progress bar
  - Queue display (top 5)
  - Requested by username

### 8. 🏆 Win Goal (`win-goal.html`)
- **Purpose**: Win counter for games
- **WebSocket**: `/ws/win-goal`
- **Events**: Win goal updates
- **Features**:
  - Current/total wins display
  - Visual progress circles
  - Filled circles for completed wins
  - Customizable title text

### 9. 🥇 Top Gifters (`topgift.html`)
- **Purpose**: Leaderboard of top gifters
- **WebSocket**: `/ws/top-gift`
- **Events**: Top gifter updates
- **Features**:
  - Top 5 leaderboard
  - Medal icons (🥇🥈🥉)
  - Gift count and diamond value
  - Real-time ranking updates

### 10. 🔥 Top Streaks (`topstreak.html`)
- **Purpose**: Gift streak leaderboard
- **WebSocket**: `/ws/top-streak`
- **Events**: Streak updates
- **Features**:
  - Top 5 streak holders
  - Fire emoji indicators
  - Pink/red theme
  - Live updates

### 11. ⚔️ Gift vs Gift (`giftvsgift.html`)
- **Purpose**: Team battle mode
- **WebSocket**: `/ws/giftvsgift`
- **Events**: Team score updates
- **Features**:
  - Two-team display
  - Live score tracking
  - VS indicator
  - Team names customizable

---

## 🎨 Adding More Overlays

If you need additional overlays (you mentioned having 14+), you can:

1. **List your other overlays** and I'll create them
2. **Copy existing overlay** HTML and modify
3. **Use the template structure**:
   ```html
   - WebSocket connection to 'wss://your-server.onrender.com/ws/YOUR_PATH'
   - Handle 'initial-state' for reconnection
   - Handle specific event types
   - Auto-reconnect on disconnect
   ```

## 📍 Common Overlay Positions in OBS

- **Top Left**: Chat, Top Gifters, Top Streaks
- **Top Center**: Timer, Win Goal
- **Center**: Lucky Wheel, Gift vs Gift
- **Bottom Center**: Song Requests, Like Goal, Follow Goal
- **Full Screen**: Gift Bubbles (transparent background)

## 🔧 Customization Tips

All overlays support:
- Custom CSS via OBS
- Adjustable positioning
- Scale transformations
- Custom colors via browser inspect

Example CSS overrides in OBS:
```css
/* Make everything bigger */
body { transform: scale(1.5); }

/* Hide connection status */
#connection-status { display: none !important; }

/* Change colors */
.progress-bar { background: red !important; }
```

---

**Total Overlays Created**: 11
**Server File**: `tikhub-overlay-server/server.js`
**All Files Located**: `tikhub-overlay-server/overlays/`

Need more? Tell me which overlays you're missing!

