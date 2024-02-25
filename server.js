const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        // Parse the incoming message as JSON
        const data = JSON.parse(message);
        console.log(`Mouse X: ${data.mouseX}, Mouse Y: ${data.mouseY}`);

        // Here you could forward these coordinates to wherever you need them
        // For example, sending them to an OSC client or handling them directly

        // Optionally, you can broadcast this message to other connected WebSocket clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); // Echoes the message to other clients
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
