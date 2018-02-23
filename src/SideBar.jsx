import React, {Component} from 'react';

class SideBar extends Component {

  render() {

    const activeUser = this.props.userList.map(user => {
      return (
        <p>{user.username}</p>
      )
    });
    console.log(this.props.typingNotification);
    return (
      <div className="bg-faded text-info">
        <h5>Active Users</h5>
        {activeUser}
        <hr />
        <h5>Activities</h5>
        <p>{this.props.typingNotification}</p>
      </div>
    )
  }

}
export default SideBar;