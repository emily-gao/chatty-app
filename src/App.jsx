import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import rando from './rando.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user: 'Emily',
      messages: [{
        id: 1,
        usertype: 'user',
        username: 'Tom',
        content: "I won't be impressed with technology until I can download food."
      }, {
        id: 2,
        usertype: 'system',
        content: 'Tom changed username to JazzyJack'
      }, {
        id: 3,
        usertype: 'user',
        username: 'Jessica',
        content: 'IMO, telecommuting is the ultimate goal.'
      }
    ]};
    this.addNewMessage = this.addNewMessage.bind(this);
  }

  addNewMessage(content) {
    const currentState = this.state.messages;
    const newState = currentState.concat({
      id: rando(),
      usertype: 'user',
      username: this.state.user,
      content: content
    });
    this.setState({ messages: newState });
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar addNewMessage={this.addNewMessage} />
      </div>
    );
  }
}

export default App;

