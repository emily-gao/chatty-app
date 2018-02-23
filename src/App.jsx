import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import SideBar from './SideBar.jsx';
import rando from './rando.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user: 'Anonymous',
      userList: [],
      typingNotification: [],
      messages: []
    };
    this.addNewMessage = this.addNewMessage.bind(this);
    this.notifyTyping = this.notifyTyping.bind(this);
  }

  notifyTyping() {
    const typingNotification = {
      type:'typingNotification'
    }
    this.socket.send(JSON.stringify(typingNotification));
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

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
  
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    console.log('Connected to server');
    // this.scrollToBottom();

    this.socket.onmessage = (event) => {  
      const message = JSON.parse(event.data);
      
      switch(message.type) {
        case 'typingNotification':
          console.log(message);
          console.log(typeof message);
          this.setState({ typingNotification: message.content });
          break;
        case 'userListMessage':
          this.setState({ userList: message.content });
          break;
        case 'userColor': 
          this.setState({ userColor: message.content});
          break;
        case 'numUsersOnline':
          this.setState({ numUsersOnline: message.content });
          break;
        case 'incomingNotification':
        case 'incomingMessage':
          const messages = this.state.messages.concat(message);
          this.setState({ messages: messages });  
          break;
        default: break;
      }
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar fixed-top navbar-light bg-primary">
          <a href="/" className="navbar-brand text-white"><i className="far fa-comment"></i> Chatty</a>
          <span className="navbar-text text-white">{this.state.numUsersOnline}</span>
        </nav>
        <main className="row">
          <div id="messages" className="col-9">
            <MessageList messages={this.state.messages} />
            <div ref={(el) => { this.messagesEnd = el; }}></div>
          </div>

          <div id="sidebar" className="col-3">
            <div className="scroll">
              <SideBar userList={this.state.userList} typingNotification={this.state.typingNotification} />
            </div>
          </div>
        </main>
        <ChatBar addNewMessage={this.addNewMessage} user={this.state.user} notifyTyping={this.notifyTyping} />
      </div>
    );
  }
}

export default App;
