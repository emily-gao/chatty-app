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
let userList = [];
let userListMessage = {
  type: 'userListMessage',
  content: userList
};
let messages = [];
let usersTypingList = [];

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
// assign 1 out of 4 colors to each user
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
// broadcast when the message always has uuid
function broadcastWithUuid(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
// broadcast to everyone else but the message originator
function broadcastToOthers(ws, message) {
  message.id = uuidv4();
  messages.push(message);
  wss.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
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

  let user = {
    username: 'Anonymous',
    id: uuidv4()
  };
  userList.push(user);  
  broadcastWithUuid(userListMessage);
  
  // notify all that a new user has joined
  const userJoin = {
    type: 'incomingNotification',
    content: 'A new user has joined the chat',
  }
  broadcast(userJoin);
  
  // broadcast messages to all users
  ws.on('message', (message) => {
    let outgoingMsg = JSON.parse(message); 
    // if this user is already typing
    // reset timeout
    if (outgoingMsg.type === 'typingNotification') {
      const timeout = function() {
        setTimeout(() => {
          usersTypingList = usersTypingList.filter(userTyping => userTyping.id !== user.id);
          
          switch(usersTypingList.length) {
            case 0:
            outgoingMsg.content = '';
            break;
            case 1:
            outgoingMsg.content = `${usersTypingList[0].username} is typing`;
            break;
            default:
            const users = '';
            usersTypingList.forEach(userTyping => users.concat(`${userTyping.username}, `));
            users.slice(0, -2);
            outgoingMsg.content = `${users} are typing`;
            break;
          }
          
          broadcastToOthers(ws, outgoingMsg);
        }, 1000);      
      };
        
      usersTypinglist = usersTypingList.filter(userTyping => userTyping.id === user.id);

      if (usersTypingList.length === 0) {
        usersTypingList.push(user);
        console.log(user);
        console.log(usersTypingList);
        // send message to all other uses
        if (usersTypingList.length === 1) {
          outgoingMsg.content = `${usersTypingList[0].username} is typing`;
        } else {
          let users = '';
          usersTypingList.forEach(userTyping => users = users.concat(`${userTyping.username}, `));
          users = users.slice(0, -2);
          outgoingMsg.content = `${users} are typing`;
        }
        broadcastToOthers(ws, outgoingMsg);
        console.log(outgoingMsg);
        // and set timeout to remove from list in 5 secs and re-send message      
        timeout();
      } else {
        clearTimeout(timeout);
        timeout();
        console.log('********');
      }

    } else {
      
      switch(outgoingMsg.type) {
        case 'postNotification': 
          userList.forEach(userListItem => {
            if (userListItem.id === user.id) {
              userListItem.username = outgoingMsg.newName;
            }
          });
          broadcastWithUuid(userListMessage);
          outgoingMsg.type = 'incomingNotification';
          break;
        case 'postMessage': 
          outgoingMsg.type = 'incomingMessage';
          break;
        default: 
          break;
      }

      broadcast(outgoingMsg);
    }

  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    logNumUsersOnline();
    console.log(user);
    userListMessage.content = userList.filter(userListItem => userListItem.id !== user.id);
    broadcastWithUuid(userListMessage);

    const userLeave = {
      type: 'incomingNotification',
      content: `${user.username} has left the chat`,
    }
    broadcast(userLeave);
  });
  
  ws.on('error', () => {
    console.log('There is an error');
  });
});