var express         = require("express"),
        app         = express(),
 bodyParser         = require("body-parser"),
   mongoose         = require("mongoose"),
   open             = require("opn"),
     Questions       = require("./models/MultiChoice.js");
     var router      = express.Router();
   app.use(express.static(__dirname + "/public"));
   app.use(express.static(__dirname + "/views"));
 app.use(express.static(__dirname + "/models"));

mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//Schema setup
var SchoolTeamSchema = new mongoose.Schema({
    name:       String,
    gradeLevel: String,
    questionID: String,
    answers:    String,
    MC_Grade:   String,
    final_grade:String
});

var Team = mongoose.model("Team", SchoolTeamSchema);

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

app.post("/submitQuestion", function(req, res) {
  console.log('req: ', req.body);
  res.redirect("/examplemultiplechoice");
});




app.get("/Questionnew",function(req, res) {
    res.render("Questionnew.ejs");
});
