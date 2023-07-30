const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

const objects = {};

io.on('connection', (socket) => {
    console.log('connected', socket.id);
    socket.emit('ready', { id: socket.id, objects: objects })
    // io.sockets.emit('status', { id: socket.id });

    socket.on('disconnect', () => {
        // console.log('disconnected', socket.id);
        delete objects[socket.id];
        io.sockets.emit('leave', { id: socket.id });
    });
    socket.on('enter', (data) => {
        // console.log('enter', data)
        objects[socket.id] = { ... data, id: socket.id };
        io.sockets.emit('enter', objects[socket.id]);
    });
    socket.on('move', (data) => {
        // console.log('move', data)
        objects[socket.id] = { ... data, id: socket.id };
        io.sockets.emit('move', objects[socket.id]);
    });
    socket.on('message', (data) => {
        // console.log('message', data);
        io.sockets.emit('message', { id: socket.id, message: data.message });
    });
});
    
server.listen(60001, () => {
  console.log('listening on *:60001');
});