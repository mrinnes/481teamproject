var express         = require("express"),
        app         = express(),
 bodyParser         = require("body-parser"),
   mongoose         = require("mongoose"),
   open             = require("opn"),
     Questions       = require("./models/MultiChoice.js");
     Team       = require("./models/Teams.js");
     var router      = express.Router();
   app.use(express.static(__dirname + "/public"));
   app.use(express.static(__dirname + "/views"));
 app.use(express.static(__dirname + "/models"));

mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//Schema setup

/*
app.get("/SchoolEntryFourm", function(req,res){
        //Get all Data from Data base
        Team.find({}, function(err, allTeams){
            if(err){
                console.log(err);
            }else{
                res.render("SchoolEntryFourm",{teams:allTeams});
            }
        })
})
app.post("/SchoolEntryFourm", function(req, res){
    var name = req.body.name;
    var gradeLevel = req.body.gradeLevel;
    var newTeam = {name:name,gradeLevel:gradeLevel}
    Team.create(newTeam,function(err, newCreated){
        if(err){
            console.log(err)
        }else{
            res.redirect("/SchoolEntryFourm");
        }
    })
});


*/

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Icompute Server has Started");
    open('http://localhost:3000');
});


//////////////////////////////////////////////////
//Schema setup





app.get("/", function(req, res){
    res.render("index");
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
})
app.post("/examplemultiplechoice", function(req, res){
    var ID = req.body.ID;
    var question = req.body.question;
    var option_A = req.body.option_A;
    var option_B = req.body.option_B;
    var option_C = req.body.option_C;
    var option_D = req.body.option_D;
    var correct_option = req.body.correct_option;
    var newQuestion = {ID:ID,question:question,option_A:option_A,option_B:option_B
        ,option_C:option_C,option_D:option_D,correct_option:correct_option}
    Questions.create(newQuestion,function(err, newCreated){
        if(err){
            console.log(err)
        }else{
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
        if(err){
            console.log(err)
        }else{
            res.redirect("/examplemultiplechoice");
        }
    })
});





app.get("/Questionnew",function(req, res) {
    res.render("Questionnew.ejs");
});

//Addeding new GET function for adding team
app.get("/Teamnew",function(req, res) {
    res.render("Teamnew.ejs");
});
