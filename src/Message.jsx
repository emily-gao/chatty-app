import React, {Component} from 'react';

class Message extends Component {
  render() {
    if (this.props.message.type === 'incomingMessage') {
      console.log('incomingMessage reached Message.jsx');

      const imgUrl = RegExp('^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$');
      if (imgUrl.test(this.props.message.content)) {
        return (
          <div className="d-flex flex-row">
            <div className="p-2" className={this.props.message.userColor}>{this.props.message.username}</div>
            <div className="p-6 text-dark"><img src={this.props.message.content} alt="tree"/></div>
          </div>
        );
      } else {
        return (
          <div className="d-flex flex-row">
            <div className="p-2" className={this.props.message.userColor}>{this.props.message.username}</div>
            <div className="p-6 text-dark">{this.props.message.content}</div>
          </div>
        );
      }
    } else if (this.props.message.type === 'incomingNotification') {
      console.log('incomingNotification reached Message.jsx');
      return (
        <div className="d-flex flex-row">
          <div className="p-6">{this.props.message.content}</div>
        </div>
      );
    }
  }

}
export default Message;