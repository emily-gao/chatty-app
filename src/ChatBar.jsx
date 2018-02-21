import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
  }
  
  handleChange(event) {
    this.setState({ content: event.target.value });
  }

  handleEnter(event) {
    if (event.key === 'Enter') {
      this.props.addNewMessage(this.state.user, this.state.content);
      this.state.content = '';
    }
  }

  // TODO: if enters a username, update username
  changeUsername(event) {
    this.setState({ user: event.target.value });
  }

  render() {
    return (
      <footer className="navbar bg-primary fixed-bottom form-row">
        <div className="col">
          <input 
            name="chatbarUsername" 
            className="form-control" 
            placeholder={this.state.user}
            onChange={this.changeUsername} />
        </div>
        <div className="col-9">
          <input 
            name="chatbarContent" 
            className="form-control" 
            placeholder="Type a message and hit ENTER"
            value={this.state.content}
            onChange={this.handleChange}
            onKeyPress={this.handleEnter} />
        </div>
      </footer>
    );
  }
}

export default ChatBar;