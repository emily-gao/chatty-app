const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on PORT ${ PORT }`));

const wss = new SocketServer({ server });

// update # of clients online
function logNumUsersOnline() {
  const oneUserOnline = '1 user online';
  const multipleUsersOnline = `${wss.clients.size} users online`;
  const numUsersOnline = {
    type: 'numUsersOnline'
  }
  wss.clients.forEach(client => {
    if (wss.clients.size === 1) {
      numUsersOnline.content = oneUserOnline;
      client.send(JSON.stringify(numUsersOnline));
    } else {
      numUsersOnline.content = multipleUsersOnline;
      client.send(JSON.stringify(numUsersOnline));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  logNumUsersOnline();

  // broadcast messages to all users
  ws.on('message', (message) => {
    const outgoingMsg = JSON.parse(message);
    outgoingMsg.id = uuidv4();

    switch(outgoingMsg.type) {
      case 'postNotification': 
        outgoingMsg.type = 'incomingNotification';
        break;
      case 'postMessage': 
        outgoingMsg.type = 'incomingMessage';
        break;
      default: break;
    }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(outgoingMsg));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    logNumUsersOnline();
  });

  ws.on('error', () => {
    console.log('There is an error');
  });
});