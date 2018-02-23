import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      content: ''
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }
  
  // TODO: if enters a username, update username
  handleUsernameChange(event) {
    this.props.notifyTyping();
    this.setState({ user: event.target.value });
  }

  handleContentChange(event) {
    this.props.notifyTyping();
    this.setState({ content: event.target.value });
  }

  handleEnter(event) {
    if (event.key === 'Enter') {
      this.props.addNewMessage(this.state.user, this.state.content);
      this.state.content = '';
    }
  }

  render() {
    return (
      <footer className="navbar bg-primary fixed-bottom form-row">
        <div className="col-3">
          <input 
            name="chatbarUsername" 
            className="form-control" 
            placeholder={this.state.user}
            onChange={this.handleUsernameChange} />
        </div>
        <div className="col-9">
          <input 
            name="chatbarContent" 
            className="form-control" 
            placeholder="Type a message and hit ENTER"
            value={this.state.content}
            onChange={this.handleContentChange}
            onKeyPress={this.handleEnter} />
        </div>
      </footer>
    );
  }
}

export default ChatBar;