/* Function that takes school and scores and prints CSV file */
function buildCSV(school,score) {
  var fs = require('fs');
  fs.open('scores.csv', 'w', function (err, file) {
    if (err) throw err;
  });
  var i;
  for (i = 0; i < school.length; i++) {
    var combined = school[i] + "," + score[i];
    fs.appendFile('scores.csv', combined + '\n', function (err) {
      if (err) throw err;
    });
  }


}

/* Function that takes school and scores and prints CSV file */
function downloadCSV() {
  var schoolArr = ["EMU", "MSU", "U of M"];
  var scoreArr  = [10,20,30];
  buildCSV(schoolArr,scoreArr);
}

downloadCSV();
