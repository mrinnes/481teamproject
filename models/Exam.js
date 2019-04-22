var mongoose = require("mongoose");


var ExamSchema = new mongoose.Schema({
	TeamID:            String,
	ExamID:            String, 
    MC_Question1:      String,
    MC_A1:             String, 
    MC_B1:             String,
    MC_C1:             String,
    MC_D1:             String,
    MC_CorrectOption1:String,
    MC_Question2:    String,
    MC_A2:             String, 
    MC_B2:             String,
    MC_C2:             String,
    MC_D2:             String,
    MC_CorrectOption2:String,
    MC_Question3:    String,
    MC_A3:             String, 
    MC_B3:             String,
    MC_C3:             String,
    MC_D3:             String,
    MC_CorrectOption3:String,
    MC_Question4:    String,
    MC_A4:             String, 
    MC_B4:             String,
    MC_C4:             String,
    MC_D4:             String,
    MC_CorrectOption4:String,  
    MC_Question5:    String,
    MC_A5:             String, 
    MC_B5:             String,
    MC_C5:             String,
    MC_D5:             String,
    MC_CorrectOption5:String,
 Scratch_Question:    String
    
      
    
});

 
module.exports=mongoose.model("Exams", ExamSchema);