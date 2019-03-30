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


app.delete("/examplemultiplechoice", function(req, res) {
  Questions.delete("examplemultiplechoice").findOneAndDelete({question: req.body.question},
  function(err, result){
    if(err) {
      res.send(500, err);
    }
    res.send("Question deleted.")
  })
});

fetch({ /* request */}) {
  .then(res {
    if(res.ok) {
      return res.json;
    }
  })
  .then(data {
    console.log(data)
    window.location.reload(true);
  })
}

<button class="btn btn-danger" type="Submit" data-toggle="button" aria-pressed="false">
  Delete
</button>


app.get("/Questionnew",function(req, res) {
    res.render("Questionnew.ejs");
});
