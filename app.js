 var express            = require("express"),
     formidable         = require("formidable"),
     fs                 = require("fs-extra"),
     app                = express(),
     bodyParser         = require("body-parser"),
     mongoose           = require("mongoose"),
     open               = require("opn"),
     passport           = require("passport"),
     LocalStrategy      = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose"),
     User               = require("./models/Users"),
     Team               = require("./models/Teams.js"),
     Tests              = require("./models/Test.js"),
     Exams              = require("./models/Exam.js"),
     Questions          = require("./models/MultiChoice"),
     ScratchGrade       = require("./models/ScratchGrade"),
     ScratchReqmts      = require("./models/ScratchReqmts"),
     router             = express.Router(),
     util               = require("util");

     app.use(express.static(__dirname + "/public"));
     app.use(express.static(__dirname + "/views"));
     app.use(express.static(__dirname + "/uploads"));
     app.use(express.static(__dirname + "/models"));
     app.use(express.static(__dirname + "/js"));
     app.use(express.static(__dirname + "/node_modules"));

     mongoose.connect("mongodb://localhost/Icompute", { useNewUrlParser: true });
     app.use(bodyParser.urlencoded( { extended: true } ));
     app.set("view engine", "ejs");

//      PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "You have Succesfully logged in",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("iCompute server has started");
    open('http://localhost:3000');
});

app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.post("/exampleteam", function(req, res) {
    var name = req.body.name;
    //var name = currentUser;
    var gradeLevel = req.body.gradeLevel;
    var MC_Grade = req.body.MC_Grade;
    var final_grade = req.body.final_grade;

    var newTeam = {
      name: name,
      gradeLevel: gradeLevel,
      MC_Grade: MC_Grade,
      final_grade: final_grade
    };

    Team.create(newTeam,function(err, newTeamCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/displayteams");
        }
    });
});

app.post("/", function(req, res) {
  console.log('req: ', req.body);
  var questions;
  var answers = Object.values(req.body);
  console.log('answers: ', answers);

  Questions.find({}, function(err, allQuestions) {
    if (err) {
      console.log(err);
    } else {
      questions = allQuestions;
      console.log('questions: ', allQuestions);
    }
  });

  res.redirect("/examplemultiplechoice");
});


app.get("/Questionnew",function(req, res) {
  res.render("Questionnew.ejs");
});

//Addeding new GET function for adding team
app.get("/Teamnew",function(req, res) {
  res.render("Teamnew.ejs");
});

app.post("/confirmDeleteQuestion", function(req, res) {
  var questionID = req.query.questionID;
  res.redirect('/examplemultiplechoice?deleteMCQuestion=' + questionID);
});

app.post("/deleteQuestion", function(req, res) {
  var deleteMCQuestionConfirmed = req.body.deleteMCQuestionConfirmed;
  var questionID = req.query.deleteQuestionID;

  if (deleteMCQuestionConfirmed) {
    Questions.deleteOne({ ID: questionID }, function(err, db) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted: " + questionID);
      }
    });
  }

  res.redirect("/examplemultiplechoice");
});

app.get("/examplemultiplechoice", function(req, res) {
  var deleteQuestionID;
  var confirmDeleteModal = false;

  if (req && req.query && req.query.deleteMCQuestion) {
    deleteQuestionID = req.query.deleteMCQuestion;
    confirmDeleteModal = true;
  }

  Questions.find({}, function(err, allQuestions) {
    if (err) {
      console.log(err);
    } else {
      res.render("examplemultiplechoice", {
        questions: allQuestions,
        confirmDeleteModal: confirmDeleteModal,
        deleteQuestionID: deleteQuestionID
      });
    }
  });
});

app.get("/enterScratchGrade", function(req, res) {

  var teams = new Array();

  Team.find({}, function(err, result){
  	if (err) {
  		console.log(err);
  	} else {
  		teams = result;
  	}
  });

  var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests

  ScratchGrade.find(query, function(err, scratchReqmtsAdmin) {
    if (err) {
      console.log(err);
    } else {
      console.log("1: " + scratchReqmtsAdmin);
      console.log("2: " + scratchReqmtsAdmin[0]);
      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].grade) {
        console.log("ScratchGrade: " , scratchReqmtsAdmin[0].grade);


        res.render("enterScratchGrade.ejs", {
          scratchGrade: scratchReqmtsAdmin[0].grade,
          teams: teams
        });
        console.log("loaded successfully");
      } else {
        console.log('howdy!!!!');

        res.render("enterScratchGrade.ejs", {
          scratchGrade: "",
          teams: []
        });
        console.log("loaded empty");
      }
    }
  })
});

app.post("/enterScratchGrade", function(req, res) {
  var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
  var update = { "grade": req.body.scratchGradeText};
  var options = { "multi": true };

  ScratchGrade.findOne({ "testID": "1" },(function(err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count == null) {
        ScratchGrade.create(query, update, options, function(err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        ScratchGrade.updateOne(query, update, options, function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
      res.redirect("/enterScratchGrade");
    }
  }));
});

app.get("/scratchRequirements", function(req, res) {
  ScratchReqmts.find({}, function(err, scratchReqmtsAdmin) {
    if (err) {
      console.log(err);
    } else {
      console.log("1: " + scratchReqmtsAdmin);
      console.log("2: " + scratchReqmtsAdmin[0]);
      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].description) {
        res.render("scratchRequirements", {
          scratchReqmts: scratchReqmtsAdmin[0].description
        });
        console.log("loaded successfully");
      } else {
        res.render("scratchRequirements", {
          scratchReqmts: ""
        });
        console.log("loaded empty");
      }
    }
  })
});

app.post("/scratchRequirements", function(req, res) {
  var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
  var update = { "description": req.body.scratchRequirementsText};
  var options = { "multi": true };

  ScratchReqmts.findOne({ "testID": "1" },(function(err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count == null) {
        ScratchReqmts.create(query, update, options, function(err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        ScratchReqmts.updateOne(query, update, options, function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
      res.redirect("/scratchRequirements");
    }
  }));
});

app.post("/examplemultiplechoice", function(req, res) {
    var newQuestion = {
        ID: req.body.ID,
        question: req.body.question,
        option_A: req.body.option_A,
        option_B: req.body.option_B,
        option_C: req.body.option_C,
        option_D: req.body.option_D,
        correct_option: req.body.correct_option
    }

    Questions.create(newQuestion, function(err, newCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/examplemultiplechoice");
        }
    });
});

app.post("/confirmDeleteTeam", function(req, res) {
  var teamName = req.query.teamName;
  res.redirect('/displayteams?deleteTeam=' + teamName);
});

app.post("/deleteTeam", function(req, res) {
  var deleteTeamConfirmed = req.body.deleteTeamConfirmed;
  var teamName = req.query.teamName;

  if (deleteTeamConfirmed) {
    Team.deleteOne({ name: teamName }, function(err, db) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted: " + teamName);
      }
    });
  }
});

app.get("/scratchRequirements", function(req, res) {
  var deleteRequirementID;
  var confirmDeleteModal = false;

  if (req && req.query && req.query.deleteRequirement) {
    deleteRequirementID = req.query.deleteRequirement;
    confirmDeleteModal = true;
  }

  ScratchReqmts.find({}, function(err, scratchReqmtsAdmin) {
    if (err) {
      console.log(err);
    } else {
      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].images) {
        var imageArray = scratchReqmtsAdmin[0].images.split(',');
        var pop = imageArray.pop();
      } else {
        var imageArray = [];
      }

      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].scratchFile) {
        var scratchFileName = scratchReqmtsAdmin[0].scratchFile;
      } else {
        var scratchFileName = "";
      }

      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].description) {
        res.render("scratchRequirements", {
          scratchReqmts: scratchReqmtsAdmin[0].description,
          images: imageArray,
          scratchFile: scratchFileName,
          confirmDeleteModal: confirmDeleteModal,
          deleteRequirementID: deleteRequirementID
        });
      } else {
        res.render("scratchRequirements", {
          scratchReqmts: "",
          images: imageArray,
          scratchFile: scratchFileName,
          confirmDeleteModal: confirmDeleteModal,
          deleteRequirementID: deleteRequirementID
        });
      }
    }
  });
});

app.post("/scratchRequirements", function(req, res) {
  var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
  var update = { "description": req.body.scratchRequirementsText};
  var options = { "multi": true };

  ScratchReqmts.findOne({ "testID": "1" },(function(err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count == null) {
        var newScratchReqmts = {
          testID: "1",
          description: req.body.scratchRequirementsText,
          images: "",
          multi: true
        };

        ScratchReqmts.create(newScratchReqmts, function(err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        ScratchReqmts.updateOne(query, update, options, function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
      res.redirect("/scratchRequirements");
    }
  }));
});


app.post("/scratchRequirementsUpload", function(req, res) {
  // ScratchReqmts.collection.deleteMany({});
  var form = new formidable.IncomingForm();

  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      form.on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name;
      })
    })

    .on('end', function(fields, files) {
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        var new_location = __dirname + '/uploads/images/';

        var fileType = file_name.split('.').pop();
        if(fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'PNG' || fileType == 'JPG') {
          fs.copy(temp_path, new_location + file_name, function(err) {
              if (err) {
                  console.error(err);
              } else {
                //Variables
                var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
                var options = { "multi": true };

                //Check to see if database exists
                ScratchReqmts.findOne({ "testID": "1" },(function(err, count) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (count == null) { //testID not found
                      var newScratchReqmts = {
                        testID: "1",
                        description: "",
                        images: (file_name + ","),
                        multi: true
                      };

                      ScratchReqmts.create(newScratchReqmts, function(err) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    } else { //If testID was found
                      var image_name = { "images": (count.images + file_name + ",") };

                      ScratchReqmts.updateOne(query, image_name, options, function(err) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  }
                }));
                  res.redirect("scratchRequirements");
              }
          });
        } else {
          console.log("Unacceptable file type.");
          res.redirect("scratchRequirements");
        }
    });
});

app.post("/confirmDeleteRequirement", function(req, res) {
  var requirementsID = req.query.requirementID;
  res.redirect('/scratchRequirements?deleteRequirement=' + requirementsID);
});

app.post("/deleteRequirement", function(req, res) {
  var deleteRequirementConfirmed = req.body.deleteRequirementConfirmed;
  var requirementID = req.query.deleteRequirementID;
  var testID = "1";

  if (deleteRequirementConfirmed) {
    ScratchReqmts.findOne({ "testID": testID },(function(err, count) {
      var imageArray = count.images.split(',');
      var pop = imageArray.pop();
      var removed = imageArray[requirementID];
      imageArray.splice(requirementID, 1);

      var duplicate = false;
      for (i=0;i<imageArray.length;i++) {
        if (imageArray[i] == removed) {
          duplicate = true;
        }
      }

      if (!duplicate) {
        var filePath = __dirname + '/uploads/images/' + removed;
        fs.unlinkSync(filePath);
      }

      if (imageArray.length != 0) {
        var imageArrayFinal = imageArray.join() + ",";
      } else {
        var imageArrayFinal = "";
      }

      ScratchReqmts.updateOne({ images: imageArrayFinal }, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }));
  }
  res.redirect("/scratchRequirements");
});

app.post("/scratchFileUpload", function(req, res) {
  // ScratchReqmts.collection.deleteMany({});
  var form = new formidable.IncomingForm();

  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      form.on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name;
      })
    })

    .on('end', function(fields, files) {
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        var new_location = __dirname + "/uploads/scratch_files/" + "Team-" + "1" + "/";

        var fileType = file_name.split('.').pop();
        if(fileType == 'sb' || fileType == 'sb2' || fileType == 'SB' || fileType == 'SB2') {
          fs.copy(temp_path, new_location + file_name, function(err) {
              if (err) {
                  console.error(err);
              } else {
                //Variables
                var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
                var options = { "multi": true };

                //Check to see if database exists
                ScratchReqmts.findOne({ "testID": "1" },(function(err, count) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (count == null) { //testID not found
                      var newScratchReqmts = {
                        testID: "1",
                        scratchFile: file_name,
                        multi: true
                      };

                      ScratchReqmts.create(newScratchReqmts, function(err) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    } else { //If testID was found
                      var scratch_file = { "scratchFile": file_name };
                      var old_scratch = count.scratchFile;
                      console.log(old_scratch);
                      if (old_scratch != undefined && old_scratch != file_name) {
                        fs.unlinkSync(new_location + old_scratch);
                      }

                      ScratchReqmts.updateOne(query, scratch_file, options, function(err) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  }
                }));
                  res.redirect("scratchRequirements");
              }
          });
        } else {
          console.log("Unacceptable file type.");
          res.redirect("scratchRequirements");
        }
    });
});

app.post("/examplemultiplechoice", function(req, res) {
    var newQuestion = {
        ID: req.body.ID,
        question: req.body.question,
        option_A: req.body.option_A,
        option_B: req.body.option_B,
        option_C: req.body.option_C,
        option_D: req.body.option_D,
        correct_option: req.body.correct_option
    }

    Questions.create(newQuestion, function(questions, newCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/examplemultiplechoice");
        }
    });
});

app.post("/confirmDeleteTeam", function(req, res) {
  var teamName = req.query.teamName;
  res.redirect('/displayteams?deleteTeam=' + teamName);
});

app.post("/deleteTeam", function(req, res) {
  var deleteTeamConfirmed = req.body.deleteTeamConfirmed;
  var teamName = req.query.teamName;

  if (deleteTeamConfirmed) {
    Team.deleteOne({ name: teamName }, function(err, db) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted: " + teamName);
      }
    });
  }

  res.redirect("/displayteams");
});

app.get("/displayteams",function(req, res) {
  var teamName;
  var confirmDeleteModal = false;

  if (req && req.query && req.query.deleteTeam) {
    teamName = req.query.deleteTeam;
    confirmDeleteModal = true;
  }

  Team.find({}, function(err, allTeams) {
    if (err) {
      console.log(err);
    } else {
      res.render("displayteams.ejs", {
        teams: allTeams,
        confirmDeleteModal: confirmDeleteModal,
        teamName: teamName
      });
    }
  });
});


app.get("/Downloadcsv",function(req, res) {
  Team.find({}, function(err, allTeams) {
      if (err) {
          console.log(err);
      } else {
          res.render("downloadcsv.ejs", { teams: allTeams });
      };
   });
});

app.post("/ExamMC", function(req,res){
  console.log('req: ', req.body);
  var questions;
  var TESTID = Object.values(req.body);

  Tests.find({},function(err,allTests){
  var Q1,Q2,Q3,Q4,Q5;
  var A1,B1,C1,D1,Answer1;
  var A2,B2,C2,D2,Answer2;
  var A3,B3,C3,D3,Answer3;
  var A4,B4,C4,D4,Answer4;
  var A5,B5,C5,D5,Answer5;
    if(err){
      console.log(err);
    }else{
      Questions.find({},function(err,allQuestions){
        if(err){
          console.log(err);
        }else{
          for(i=0;i<allTests.length;i++){
          //  console.log(allQuestions[i].ID);
             if(allTests[i].TestID==TESTID){
              console.log(allTests[i].TestID);
              for(z=0;z<allQuestions.length;z++){

                if(allTests[i].MC_Question1ID==allQuestions[z].ID){

                  Q1=allQuestions[z].question;
                  A1=allQuestions[z].option_A;
                  B1=allQuestions[z].option_B;
                  C1=allQuestions[z].option_C;
                  D1=allQuestions[z].option_D;
                  Answer1=allQuestions[z].correct_option;
                  console.log(Q1);
                  console.log(A1);
                  console.log(B1);
                  console.log(C1);
                  console.log(D1);
                  console.log(Answer1);
                }
                if(allTests[i].MC_Question2ID==allQuestions[z].ID){

                  Q2=allQuestions[z].question;
                  A2=allQuestions[z].option_A;
                  B2=allQuestions[z].option_B;
                  C2=allQuestions[z].option_C;
                  D2=allQuestions[z].option_D;
                  Answer2=allQuestions[z].correct_option;
                  console.log(Q2);
                  console.log(A2);
                  console.log(B2);
                  console.log(C2);
                  console.log(D2);
                  console.log(Answer2);
                }
                if(allTests[i].MC_Question3ID==allQuestions[z].ID){

                  Q3=allQuestions[z].question;
                  A3=allQuestions[z].option_A;
                  B3=allQuestions[z].option_B;
                  C3=allQuestions[z].option_C;
                  D3=allQuestions[z].option_D;
                  Answer3=allQuestions[z].correct_option;
                  console.log(Q3);
                  console.log(A3);
                  console.log(B3);
                  console.log(C3);
                  console.log(D3);
                  console.log(Answer3);
                }
                if(allTests[i].MC_Question4ID==allQuestions[z].ID){

                  Q4=allQuestions[z].question;
                  A4=allQuestions[z].option_A;
                  B4=allQuestions[z].option_B;
                  C4=allQuestions[z].option_C;
                  D4=allQuestions[z].option_D;
                  Answer4=allQuestions[z].correct_option;
                  console.log(Q4);
                  console.log(A4);
                  console.log(B4);
                  console.log(C4);
                  console.log(D4);
                  console.log(Answer4);
                }
                if(allTests[i].MC_Question5ID==allQuestions[z].ID){

                  Q5=allQuestions[z].question;
                  A5=allQuestions[z].option_A;
                  B5=allQuestions[z].option_B;
                  C5=allQuestions[z].option_C;
                  D5=allQuestions[z].option_D;
                  Answer5=allQuestions[z].correct_option;
                  console.log(Q5);
                  console.log(A5);
                  console.log(B5);
                  console.log(C5);
                  console.log(D5);
                  console.log(Answer5);


                }
             }

          }

        }
      }
  var newExam={Q1,Q2,Q3,Q4,Q5,
   A1,B1,C1,D1,Answer1,
   A2,B2,C2,D2,Answer2,
   A3,B3,C3,D3,Answer3,
   A4,B4,C4,D4,Answer4,
   A5,B5,C5,D5,Answer5}
   console.log(newExam);
   Exams.create(newExam,function(err,allExam){
    if(err){
      console.log(err);
    }else

    res.render("ExamMC.ejs",{
      Q1:Q1,
      A1:A1,
      B1:B1,
      C1:C1,
      D1:D1,
      Answer1:Answer1,
      Q2:Q2,
      A2:A2,
      B2:B2,
      C2:C2,
      D2:D2,
      Answer2:Answer2,
      Q3:Q3,
      A3:A3,
      B3:B3,
      C3:C3,
      D3:D3,
      Answer3:Answer3,
      Q4:Q4,
      A4:A4,
      B4:B4,
      C4:C4,
      D4:D4,
      Answer4:Answer4,
      Q5:Q5,
      A5:A5,
      B5:B5,
      C5:C5,
      D5:D5,
      Answer5:Answer5

    });
   });
      });
    }
});
});


app.get("/ExamMC", function(req,res){
   Exams.find({}, function(err, allExam) {
    if (err) {
      console.log(err);
    } else {
      res.render("ExamMC.ejs");
    }
  });
});


app.post("/Exam",function(req,res){
    var TestID         =req.body.TestID

    var MC_Question1ID = req.body.MC_Question1ID;

    var MC_Question2ID = req.body.MC_Question2ID;

    var MC_Question3ID = req.body.MC_Question3ID;

    var MC_Question4ID = req.body.MC_Question4ID;

    var MC_Question5ID = req.body.MC_Question5ID;

    var Scratch_QuestionID = req.body.Scratch_QuestionID;

    var newTest = {
      TestID:TestID,
      MC_Question1ID:MC_Question1ID,
      MC_Question2ID:MC_Question2ID,
      MC_Question3ID:MC_Question3ID,
      MC_Question4ID:MC_Question4ID,
      MC_Question5ID:MC_Question5ID,
      Scratch_QuestionID:Scratch_QuestionID};

      Tests.create(newTest,function(err,Tests,allTests){
        if(err){
          console.log(err);
        }else{
        res.redirect("/Exam");
      }
      });

});

app.get("/Exam", function(req, res) {

  Tests.find({},function(err, allTests) {

    if (err) {
      console.log(err);
    } else {
      console.log(allTests);
      res.render("Exam.ejs", {

        Tests: allTests,
      });
    }
  });
});

///AUTH ROUTES

//SHOW REGISTER FORM
app.get("/index", function(req, res) {
    res.render("index.ejs");
});

app.get("/register",function(req,res) {
    res.render("register.ejs");
});


////////handle sign in logic
app.post("/register", function(req,res) {
   var newUser = {
      isAdmin: false,
      isGrader: false,
      isTeam: false
   };

   if (req.body.adminCode === process.env.ADMIN_CODE) {
     newUser.isAdmin = true;
   }

   if (req.body.teamCode === process.env.TEAM_CODE) {
     newUser.isAdmin = true;
   }

   if (req.body.graderCode === process.env.GRADER_CODE) {
     newUser.isAdmin = true;
   }

   User.register(

     new User({
       username: req.body.username,
       isTeam: req.body.isTeam,
       isGrader: req.body.isGrader,
       isAdmin: req.body.isAdmin
     }),
     req.body.password, function(err, User) {
       if (err) {
         console.log(err);
         return res.render("register")
       }

       passport.authenticate("local")(req, res, function() {
         res.redirect("/index");
       });
     }
  );
});

//show login form
app.get("/login", function(req,res) {
    res.render("login.ejs");
});

//handle login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/register"
  }), function(req, res) {});

// logic route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

app.post("/submitQuestion", function(req, res) {
  console.log('req: ', req.body);
  var questions;
  var answers = Object.values(req.body);
  //console.log('answers: ', answers);


  //grab the questions
  Questions.find({}, function(err, allQuestions) {
    if (err) {
		console.log(err);}
	else {
		questions = allQuestions;
		counter = 0;

		for (i = 0; i < allQuestions.length; i++) {
			if (allQuestions[i].correct_option === answers[i]) {
				console.log(allQuestions[i].ID, ' is correct');
				counter++;
				}
			else {
				//console.log(allQuestions[i].ID, ' is incorrect');
				}
			}

		console.log(counter + " correct answers");
		res.locals.currentUser = req.user;
		var query = {"name": res.locals.currentUser.username};
		var update = { "$set": { "MC_Grade": counter }};
		var options = { "multi": true };

		console.log(query);
		Team.updateOne(query, update, options, function (err) {
			if (err) return console.error(err);
			else {
				res.redirect("/mcdone");
			}
			});
		}
	});
});

app.get("/mcdone", function(req, res) {
    res.render("mcdone.ejs");
});
