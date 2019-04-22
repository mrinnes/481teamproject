var mongoose = require("mongoose");

var ScratchGradeSchema = new mongoose.Schema({
  testID: String,
  grade: Number,
});

module.exports=mongoose.model("ScratchGrade", ScratchGradeSchema)
