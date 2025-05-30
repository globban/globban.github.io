const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files (including your driftr.html and car assets)
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // When receiving a car update from a client, broadcast it to others.
    socket.on('carUpdate', (data) => {
        // Add the socket id so receivers can identify the player.
        data.id = socket.id;
        socket.broadcast.emit('carUpdate', data);
    });

    // Optional: handle disconnects.
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        // Broadcast disconnection so clients can remove that player's car.
        socket.broadcast.emit('playerDisconnected', { id: socket.id });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});