import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [{
      id: 1,
      username: 'Tom',
      content: "I won't be impressed with technology until I can download food."
    }, {
      id: 2,
      username: 'Jessica',
      content: 'Wrong, telecommuting is the ultimate goal.'
    }]};
  }

  setState() {

  }

  render() {
    const messages = this.state.messages.map(message => {
      return (<Message id={message.id} username={message.username} content={message.content} />);
    });

    return (
      <main className="messages">
        {messages}
        <div className="message system">
          Anonymous1 changed their name to nomnom.
        </div>
      </main>
    );
  }
}
export default MessageList;