import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import rando from './rando.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user: 'Anonymous',
      messages: []
    };
    this.addNewMessage = this.addNewMessage.bind(this);
  }

  addNewMessage(user, content) {
    // system messages
    if (user !== this.state.user) {
      const oldUser = this.state.user;
      this.setState({ user: user });
      const notification = {
        type: 'postNotification',
        newName: user,
        content: `${oldUser} changed their name to ${user}.`
      }
      this.socket.send(JSON.stringify(notification));
    }

    // user messages
    const message = { 
      type: 'postMessage',
      username: user, 
      userColor: this.state.userColor,
      content: content 
    };
    this.socket.send(JSON.stringify(message));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    console.log('Connected to server');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch(message.type) {
        case 'userColor': 
          this.setState({ userColor: message.content})
          break;
        case 'numUsersOnline':
          this.setState({ numUsersOnline: message.content });
          break;
        case 'incomingNotification':
        case 'incomingMessage':
          console.log(message);
          const messages = this.state.messages.concat(message);
          this.setState({ messages: messages });  
          break;
        default: break;
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-primary">
          <a href="/" className="navbar-brand text-white"><i className="far fa-comment"></i> Chatty</a>
          <span className="navbar-text text-white">{this.state.numUsersOnline}</span>
        </nav>
          
        <MessageList messages={this.state.messages} />
        <ChatBar addNewMessage={this.addNewMessage} user={this.state.user} />
      </div>
    );
  }
}

export default App;

