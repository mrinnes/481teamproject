 var express            = require("express"),
     app                = express(),
     bodyParser         = require("body-parser"),
     mongoose           = require("mongoose"),
     open               = require("opn"),
     passport           = require("passport"),
     LocalStrategy      = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose")
     User               = require("./models/Users"),
     Teams              = require("./models/Teams.js");
     Questions          = require("./models/MultiChoice");
     var router         = express.Router();

     app.use(express.static(__dirname + "/public"));
     app.use(express.static(__dirname + "/views"));
     app.use(express.static(__dirname + "/models"));

     mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
     app.use(bodyParser.urlencoded({extended: true}));
     app.set("view engine", "ejs");

//      PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "You have Succesfully loged in",
    resave: false,
    saveUnitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/examplemultiplechoice", function(req,res){
        //Get all Data from Data base
        Questions.find({}, function(err, allQuestions){
            if(err){
                console.log(err);
            }else{
                res.render("examplemultiplechoice",{questions:allQuestions});
            }
        })
});

app.post("/examplemultiplechoice", function(req, res){
    var newQuestion = {
        ID: req.body.ID,
        question: req.body.question,
        option_A: req.body.option_A,
        option_B: req.body.option_B,
        option_C: req.body.option_C,
        option_D: req.body.option_D,
        correct_option: req.body.correct_option
    }

    Questions.create(newQuestion, function(err, newCreated){
        if (err) {
            console.log(err)
        } else {
            res.redirect("/examplemultiplechoice");
        }
    })
});

app.post("/exampleteam", function(req, res){
    var name = req.body.name;
    var gradeLevel = req.body.gradeLevel;
    var MC_Grade = req.body.MC_Grade;
    var final_grade = req.body.final_grade;
    var newTeam = {name:name,gradeLevel:gradeLevel,MC_Grade:MC_Grade,final_grade:final_grade}
    Team.create(newTeam,function(err, newTeamCreated){
        if (err) {
            console.log(err)
        } else {
            res.redirect("/examplemultiplechoice");
        }
    });
});

app.post("/submitQuestion", function(req, res) {
  console.log('req: ', req.body);
  res.redirect("/examplemultiplechoice");

});

app.get("/Questionnew",function(req, res) {
    res.render("Questionnew.ejs");
});


//Addeding new GET function for adding team
app.get("/Teamnew",function(req, res) {
    res.render("Teamnew.ejs");
});

//Addeding new GET function for adding team
app.get("/Downloadcsv",function(req, res) {
  Team.find({}, function(err, allTeams){
      if (err) {
          console.log(err);
      } else {
          res.render("downloadcsv.ejs",{ teams: allTeams });
      }
  });
});


///AUTH ROUTES

//SHOW REGISTER FORM
app.get("/index", function(req, res){
    res.render("index.ejs");
});

app.get("/register",function(req,res){
    res.render("register.ejs");
});


////////handle sign in logic
app.post("/register", function(req,res){
   req.body.username
   req.body.password
   req.body.isTeam
   req.body.isGrader
   req.body.isAdmin
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
}
 if(req.body.teamCode === process.env.TEAM_CODE) {
      newUser.isAdmin = true;
}
 if(req.body.graderCode === process.env.GRADER_CODE) {
      newUser.isAdmin = true;
}
   User.register(new User({username: req.body.username,isTeam: req.body.isTeam, isGrader: req.body.isGrader, isAdmin: req.body.isAdmin}),req.body.password, function(err, User){
    if(err){
        console.log(err);
        return res.render("register")
    }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/index");
        });
   });
});

//show login form
app.get("/login",function(req,res){
    res.render("login.ejs");
});
//handle login logic

app.post("/login",passport.authenticate("local",
        {
            successRedirect: "/index",
            failureRedirect: "/register"
         }), function(req,res){

});
// logic route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//////show and hide links

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Icompute Server has Started");
    open('http://localhost:3000');
});
