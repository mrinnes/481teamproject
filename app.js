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
     Questions          = require("./models/MultiChoice"),
     //ScratchReqmts      = require("./models/ScratchReqmts"),
     ScratchGrade		= require("./models/ScratchGrade"),
     router             = express.Router();

     app.use(express.static(__dirname + "/public"));
     app.use(express.static(__dirname + "/views"));
     app.use(express.static(__dirname + "/models"));
     app.use(express.static(__dirname + "/js"));

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
