Chatty
=====================

Primarily a client-side SPA (single-page app) built with ReactJS
Contains a chat log displaying messages and notifications
Contains an input field to change your name and an input field to send a message
The client-side app communicates with a server via WebSockets for multi-user real-time updates
No persistent database is involved; the focus is on the client-side experience

![gif to display features](http://recordit.co/nDhipoPpI5)

### Basic Features

* When any connected user sends a chat message, all connected users receive and display the message
* When any connected user changes their name, all connected users are notified of the name change
    * Notifications are styled differently from chat messages
* Header will display the count of connected users
* When the number of connected users changes, this count will be updated for all connected users

### Extra Features

* Links to images will be auto-deleted and the images will be fetched from the link and displayed
* Different users' names will each be coloured differently and the colouring is consistent between connected user instances
* A list of active users with their usernames are displayed
* When any connected user is typing, either to update their username or input a message, all other connected users are notified
* When the list of messages are longer that the fixed height of the component, the page auto-scrolls to the newest message at the bottom

### Dependencies

* React
* Webpack
* [babel-loader](https://github.com/babel/babel-loader)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
* [express](https://github.com/expressjs/express)
* [uuid](https://github.com/kelektiv/node-uuid)
* [ws](https://github.com/websockets/ws)
