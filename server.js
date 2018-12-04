// const express = require('express'),
// 	app = express(),
// 	server = require('http').createServer(app),
// 	io = require('socket.io').listen(server);

// app.set('view engine', 'hbs')
// app.use(express.static(__dirname + '/public'));

// server.listen(8080)

// app.get('/testchat', function (req, res) {
// 	res.render('chat.hbs');
// });

// io.sockets.on('connection', function (socket) {
// 	console.log('User has connected');
// 	socket.on('sending message', function (data) {
// 		io.sockets.emit('new message', data);
// 	});

// 	socket.on('disconnect', function (data) {
// 		console.log('User has disconnected');
// 	});
// });

