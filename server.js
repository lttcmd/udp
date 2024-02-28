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

        // Check if the message contains 'size'
        if (data.size !== undefined) {
            console.log(`Size: ${data.size}`);
            // Additional handling for 'size' messages here
        }

        if (data.radius !== undefined) {
            console.log(`Radius: ${data.radius}`);
            // Additional handling for 'radius' here
        }

        // Check if the message contains 'mouseX' and 'mouseY'
        if (data.mouseX !== undefined && data.mouseY !== undefined) {
            console.log(`Mouse X: ${data.mouseX}, Mouse Y: ${data.mouseY}`);
            // Additional handling for 'mouseX' and 'mouseY' messages here
        }

        // Handling double tap event
        if (data.dtap !== undefined && data.dtap === true) {
            console.log('Double Tap received');
            // Additional handling for 'dtap' event here
        }

        if (data.colourx !== undefined && data.coloury !== undefined) {
            console.log(`Colour X: ${data.colourx}, Colour Y: ${data.coloury}`);
        }

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
