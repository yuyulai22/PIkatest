var socket_io = require('socket.io');
var expressSession = require("express-session");
var passportSocketIo = require("passport.socketio");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessionStore = require('sessionstore');

var io = socket_io();
var socketApi = {};

socketApi.io = io;


//listen on every connection
io.sockets.on('connection', (socket) => {
	console.log('New user connected')
	//default username
	socket.username = "Anonymous"

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})

module.exports = socketApi;
