var currUser = "";

//get current user
function getCurrentUser(){
       return $.ajax({
            type: "GET",
            url: "/currentUser",
            success: function(res) {
                console.log("res cur user is", res);  
                currUser = res; 
            }
        });
}

$(function(){
   	//make connection
	var socket = io.connect('https://thawing-island-64670.herokuapp.com')
	getCurrentUser();
	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username+ ": " + data.message + "</p>")
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});