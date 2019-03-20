
var mongoose = require("mongoose");


var QuestionSchema = new mongoose.Schema({
    ID:       String,
    question: String,
    option_A: String,
    option_B: String,
    option_C: String,
    option_D: String,
    correct_option:String
});

 
module.exports=mongoose.model("Questions", QuestionSchema) 
