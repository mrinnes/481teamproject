var mongoose = require("mongoose");


var TestSchema = new mongoose.Schema({
	TestID:            String, 
    MC_Question1ID:    String,
    MC_Question2ID:    String,
    MC_Question3ID:    String,
    MC_Question4ID:    String,
    MC_Question5ID:    String,
 Scratch_QuestionID:    String
    
      
    
});

 
module.exports=mongoose.model("Tests", TestSchema);