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
        content: `${oldUser} changed their name to ${user}.`
      }
      this.socket.send(JSON.stringify(notification));
    }

    // user messages
    const message = { 
      type: 'postMessage',
      username: user, 
      content: content 
    };
    this.socket.send(JSON.stringify(message));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    console.log('Connected to server');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'numUsersOnline') {
        this.setState({ numUsersOnline: message.content });
      } else if (message.type === 'incomingNotification' || 'incomingMessage') {
        const messages = this.state.messages.concat(message);
        // console.log(messages);
        this.setState({ messages: messages });
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
          <i className="far fa-comment"></i>
        <MessageList messages={this.state.messages} />
        <ChatBar addNewMessage={this.addNewMessage} user={this.state.user} />
      </div>
    );
  }
}

export default App;

