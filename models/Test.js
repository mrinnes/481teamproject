var mongoose = require("mongoose");


var TestSchema = new mongoose.Schema({
	TeamIDkey: 		 String,
	TestID:          String,
    MC_Question:    String,
    MC_AnswerA:      String,
    MC_AnswerB:      String,
    MC_AnswerC:      String,
    MC_AnswerD:      String,
    MC_Correct:       String   
    
});

 
module.exports=mongoose.model("Test", TestSchema) 