var express         = require("express");
var mongoose        = require("mongoose");
var Team            = require("../models/Teams.js");

mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });

/* Function that creates a .csv file and adds school name and scores */
function buildCSV(school,score) {
  var fs = require('fs'); //Create File Stream
  fs.open('scores.csv', 'w', function (err, file) { //Create the .csv file, throws error if error
    if (err) throw err;
  });
  var i; //Creates counting variable for the for loop.
  for (i = 0; i < school.length; i++) { //Run loop once for each school in school array
    var combined = school[i] + "," + score[i]; //Combines the school and scores, and seperates by comma.
    fs.appendFile('scores.csv', combined + '\n', function (err) { //Writes (appends) to the file.
      if (err) throw err;
    });
  }
}

/* Function that takes school and scores and passes it to buildCSV */
function downloadCSV() {
  var schoolArr = [];
  var scoreArr = [];
  var u = Team.find({}, { name: 1, final_grade: 1, _id: 0}, function(err, data){
    if(err){
      console.log(err);
    }else{
      //Set school names
      data.forEach(function(row){
        schoolArr.push(row.name);
      })

      //Set score
      data.forEach(function(row){
        scoreArr.push(row.final_grade);
      })

      buildCSV(schoolArr,scoreArr);
    }
  })
}

downloadCSV();
