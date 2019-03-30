var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	isTeam: {type: Boolean, default: false},
	isGrader: {type: Boolean, default: false},
	isAdmin: {type: Boolean, default: false}
})

UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", UserSchema);