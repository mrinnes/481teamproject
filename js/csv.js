/* Function that takes school and scores and prints CSV file */
function buildCSV(school,score) {
  var combined = school + "," + score;
  var fs = require('fs');
  var stream = fs.createWriteStream("my_file.csv");
  stream.once('open', function(fd) {
    stream.write(school + "," + score);
    stream.end();
  });

}

/* Function that takes school and scores and prints CSV file */
function downloadCSV(school,score) {
  console.log("test 2");

}

buildCSV("EMU",10);
