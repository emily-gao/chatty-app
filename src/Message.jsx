import React, {Component} from 'react';

class Message extends Component {
  render() {
    if (this.props.message.type === 'incomingMessage') {
      console.log('incomingMessage reached Message.jsx');

      const imgUrl = RegExp('^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$');
      if (imgUrl.test(this.props.message.content)) {
        return (
          <div className="message row">
            <div className="col-4">
              <span className={this.props.message.userColor}>{this.props.message.username}</span>
            </div>
            <div className="col-8">
              <img src={this.props.message.content} alt="tree"/>
            </div>      
          </div>
        );
      } else {
        return (
          <div className="message row">
            <div className="col-4">
              <span className={this.props.message.userColor}>{this.props.message.username}</span>
            </div>
            <div className="col-8">
              <span className="text-dark">{this.props.message.content}</span>
            </div>      
          </div>
        );
      }
    } else if (this.props.message.type === 'incomingNotification') {
      console.log('incomingNotification reached Message.jsx');
      return (
        <div className="font-italic">
          <div className="col-12 text-muted">{this.props.message.content}</div>
        </div>
      );
    }
  }

}
export default Message;