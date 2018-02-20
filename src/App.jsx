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

  addNewMessage(content) {
    const message = { usertype: 'user', username: this.state.user, content: content };
    this.socket.send(JSON.stringify(message));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    console.log('Connected to server');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      const messages = this.state.messages.concat(message);
      console.log(messages);
      this.setState({ messages: messages });
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar addNewMessage={this.addNewMessage} user={this.state.user} />
      </div>
    );
  }
}

export default App;

