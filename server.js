const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from overlays directory
app.use('/overlays', express.static(path.join(__dirname, 'overlays')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'overlays', 'index.html'));
});

// Store connected WebSocket clients
const chatClients = new Set();

// Create WebSocket server for chat overlay
const wss = new WebSocket.Server({ 
  server,
  path: '/ws/chat',
  perMessageDeflate: false // Disable compression for better performance
});

wss.on('connection', (ws, req) => {
  console.log('[WebSocket] New chat overlay client connected');
  chatClients.add(ws);

  // Send connection confirmation
  ws.send(JSON.stringify({ type: 'connected', message: 'Chat overlay connected' }));

  ws.on('close', () => {
    console.log('[WebSocket] Chat overlay client disconnected');
    chatClients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('[WebSocket] Chat overlay client error:', error);
    chatClients.delete(ws);
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('[WebSocket] Received message from client:', data.type);
      // Handle client messages if needed (e.g., ping/pong, settings)
    } catch (error) {
      console.error('[WebSocket] Error parsing client message:', error);
    }
  });
});

// API endpoint for Electron app to send chat events
app.post('/api/chat-event', (req, res) => {
  try {
    const eventData = req.body;
    console.log('[API] Received chat event:', eventData.type || 'unknown');

    // Broadcast to all connected chat overlay clients
    const message = JSON.stringify({
      type: 'tiktok-event',
      payload: eventData
    });

    let sentCount = 0;
    chatClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
          sentCount++;
        } catch (error) {
          console.error('[API] Error sending to client:', error);
          chatClients.delete(client);
        }
      }
    });

    console.log(`[API] Broadcasted to ${sentCount} client(s)`);
    res.json({ success: true, sentTo: sentCount });
  } catch (error) {
    console.error('[API] Error processing chat event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedClients: chatClients.size,
    uptime: process.uptime()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Server] TikHub Overlay Server running on port ${PORT}`);
  console.log(`[Server] WebSocket endpoint: ws://localhost:${PORT}/ws/chat`);
  console.log(`[Server] API endpoint: http://localhost:${PORT}/api/chat-event`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, closing server...');
  server.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});
