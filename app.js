 var express            = require("express"),
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
     ScratchReqmts      = require("./models/ScratchReqmts"),
     router             = express.Router();

     app.use(express.static(__dirname + "/public"));
     app.use(express.static(__dirname + "/views"));
     app.use(express.static(__dirname + "/models"));

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

app.get("/scratchRequirements", function(req, res) {
  ScratchReqmts.find({}, function(err, scratchReqmtsAdmin) {
    if (err) {
      console.log(err);
    } else {
      if (scratchReqmtsAdmin && scratchReqmtsAdmin[0] && scratchReqmtsAdmin[0].description) {
        res.render("scratchRequirements", {
          scratchReqmts: scratchReqmtsAdmin[0].description
        });
      } else {
        res.render("scratchRequirements", {
          scratchReqmts: ""
        });
      }
    }
  })
});

app.post("/scratchRequirements", function(req, res) {
  var query = { "testID": "1" }; // hardcoded for now until Al implements capability for multiple tests
  var update = { $set: { "description": req.body.scratchRequirementsText } };
  var options = { "multi": true };

  ScratchReqmts.updateOne(query, update, options, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/scratchRequirements");
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
      }
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
