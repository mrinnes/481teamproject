var Team            = require("../models/Teams.js");
var mongoose        = require("mongoose");
mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
Team.collection.deleteMany({});
