var express         = require("express"),
        app         = express(),
 bodyParser         = require("body-parser"),
   mongoose         = require("mongoose")
   
   
   
mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });   
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


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


app.get("/", function(req, res){
    res.render("landing");
});


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


app.get("/new",function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Icompute Server has Started");
});


//////////////////////////////////////////////////
//Schema setup
var QuestionSchema = new mongoose.Schema({
    ID:       String,
    Type: String,
    question: String,
    option_A: String,
    option_B: String,
    option_C: String,
    option_D: String,
    correct_option:String
});

var Question = mongoose.model("Question", QuestionSchema);


app.get("/", function(req, res){
    res.render("landing");
});


app.get("/QuestionSubMissionFourm", function(req,res){
        //Get all Data from Data base
        Question.find({}, function(err, allQuestions){
            if(err){
                console.log(err);
            }else{
                res.render("QuestionSubMissionFourm",{questions:allQuestions});
            }
        })
       
})
app.post("/QuestionSubMissionFourm", function(req, res){
    var ID = req.body.ID;
    var type = req.body.type;
    var question = req.body.question;
    var newQuestion = {ID:ID,type:type,question:question}
    Question.create(newQuestion,function(err, newCreated){
        if(err){
            console.log(err)
        }else{
            res.redirect("/QuestionSubMissionFourm");
        }
    })
    
    
});


app.get("/Questionnew",function(req, res) {
    res.render("Questionnew.ejs");
});

