var mongoose = require("mongoose");

var ScratchReqmtsSchema = new mongoose.Schema({
  testID: String,
  description: String,
  image1: {data:Buffer,contentType:String},
  image2: {data:Buffer,contentType:String},
  image3: {data:Buffer,contentType:String}
});

module.exports=mongoose.model("ScratchReqmts", ScratchReqmtsSchema)
