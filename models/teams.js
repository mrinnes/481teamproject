
var mongoose = require("mongoose");


var SchoolTeamSchema = new mongoose.Schema({
    team_ID:            String,
    name:               String,
    gradeLevel:         Number,
    question_ID_01:     Number,
    question_ID_02:     Number,
    question_ID_03:     Number,
    question_ID_04:     Number,
    question_ID_05:     Number,
    answer_01:          String,
    answer_02:          String,
    answer_03:          String,
    answer_04:          String,
    answer_05:          String,
    MC_Grade:           Number,
    final_grade:        Number
});


module.exports=mongoose.model("Team", SchoolTeamSchema)
