const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on PORT ${ PORT }`));
const wss = new SocketServer({ server });

const colors = ['text-success', 'text-info', 'text-warning', 'text-danger'];
const messages = [];

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

function assignUserColor(ws) {
  const index = Math.floor(Math.random() * 4);
  const userColorMsg = {
    type: 'userColor',
    content: colors[index]
  }
  ws.send(JSON.stringify(userColorMsg));
}

// add new message to messages array and send to every open connection
function broadcast(message) {
  message.id = uuidv4();
  messages.push(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  logNumUsersOnline();
  assignUserColor(ws);
  messages.splice(-10).forEach(message => {
    ws.send(JSON.stringify(message));
  })
  const username = 'Anonymous';
  
  // notify all that a new user has joined
  const userJoin = {
    type: 'incomingNotification',
    content: 'A new user has joined the chat',
  }
  broadcast(userJoin);
  
  // broadcast messages to all users
  ws.on('message', (message) => {
    const outgoingMsg = JSON.parse(message);
    
    switch(outgoingMsg.type) {
      case 'postNotification': 
      username = outgoingMsg.newName;
      outgoingMsg.type = 'incomingNotification';
      break;
      case 'postMessage': 
      outgoingMsg.type = 'incomingMessage';
      break;
      default: break;
    }
    
    broadcast(outgoingMsg);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    logNumUsersOnline();
    
    const userLeave = {
      type: 'incomingNotification',
      content: `${username} has left the chat`,
    }
    broadcast(userLeave);
  });
  
  ws.on('error', () => {
    console.log('There is an error');
  });
});