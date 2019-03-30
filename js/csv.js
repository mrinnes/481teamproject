var express         = require("express");
var mongoose        = require("mongoose");
var Team            = require("../models/Teams.js");

mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });

/* Function that creates a .csv file and adds school name and scores */
function buildCSV(school,score) {
  let csvFile = "data:text/csv;charset=utf-8,";
  for (var i = 0; i < school.length; i++) { //Run loop once for each school in school array
    let row = school[i] + "," + score[i];
    csvFile += row + "\r\n";
  }
  var encodedUri = encodeURI(csvFile);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Team_Scores.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
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
