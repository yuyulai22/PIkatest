var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/pikame');
var db = mongoose.connection;

//user schema 
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String 
	},
	pokeselect: {
		type: String
	}
	
});

//export user schema
var User = module.exports = mongoose.model('User', UserSchema);


//appends selected pokemon to db
module.exports.appendPoke = function(regUser, pokemonname, callback){
	console.log('appending pokemon', regUser, pokemonname);
	regUser.pokeselect = pokemonname;
	regUser.save(callback);
	console.log('done appending pokemon', regUser, pokemonname);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.gettingUser = function(regUser, callback){
	console.log('getting user', regUser);
	console.log('done getting', regUser);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	console.log("query", query);
	User.findOne(query, callback);
}

//compares pw using bcrypt
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}
;
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB.
        	newUser.password = hash;
        	newUser.save(callback);

    	});
	});
}





