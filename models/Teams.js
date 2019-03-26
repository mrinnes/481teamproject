
var mongoose = require("mongoose");


var SchoolTeamSchema = new mongoose.Schema({
    name:       String,
    gradeLevel: String,
    questionID: String,
    answers:    String,
    MC_Grade:   String,
    final_grade:String
});


module.exports=mongoose.model("Team", SchoolTeamSchema)
