import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { content: '' };
  }

  render() {
    const onChange = (event) => {
      const currentContent = this.state.content;
      const newContent = currentContent.concat(event.target.value);
      this.setState({ content: newContent });
    };
    const onEnter = (event) => {
      if (event.key === 'Enter') {
        this.props.addNewMessage(event.target.value);
        event.target.value = '';
      }
    };

    // TODO: if enters a username, update username

    return (
      <footer className="chatbar">
        <input name="chatbarUsername" className="chatbar-username" placeholder="Your Name (Optional)" />
        <input 
          name="chatbarContent" 
          className="chatbar-content" 
          placeholder="Type a message and hit ENTER"
          onChange={onChange}
          onKeyPress={onEnter}
        />
      </footer>
    );
  }
}

export default ChatBar;
