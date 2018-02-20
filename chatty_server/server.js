const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const CLIENTS = [];

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on PORT ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  CLIENTS.push(ws);

  ws.on('message', (message) => {
    const outgoingMsg = JSON.parse(message);
    outgoingMsg.id = uuidv4();
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(outgoingMsg));
      }
    });
  });

  ws.on('close', () => {
    CLIENTS.splice(CLIENTS.indexOf(ws), 1);
    console.log('Client disconnected');
  });

  ws.on('error', () => {
    CLIENTS.splice(CLIENTS.indexOf(ws), 1);
  });
});