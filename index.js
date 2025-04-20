const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const { syncEvents } = require('./app');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocket.Server({ server });

console.log('WebSocket server is running');

let syncStatus = 'idle';

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.send(JSON.stringify({ status: syncStatus }));
});

// Endpoint to trigger manual sync
app.post('/sync', async (req, res) => {
  try {
    console.log('Sync process started');
    syncStatus = 'running';
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ status: syncStatus }));
      }
    });

    await syncEvents();

    syncStatus = 'completed';
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ status: syncStatus }));
      }
    });

    console.log('Sync process completed');
    res.status(200).send('Sync completed successfully');
  } catch (error) {
    syncStatus = 'error';
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ status: syncStatus }));
      }
    });
    console.error('Sync process failed:', error);
    res.status(500).send('Sync failed');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
