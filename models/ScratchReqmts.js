var mongoose = require("mongoose");

var ScratchReqmtsSchema = new mongoose.Schema({
  testID: String,
  description: String
});

module.exports=mongoose.model("ScratchReqmts", ScratchReqmtsSchema)
