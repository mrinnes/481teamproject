var express         = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
open                = require("opn"),
Questions           = require("./models/MultiChoice.js");
Team                = require("./models/teams.js");
var router          = express.Router();

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/models"));

mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");





app.get("/grade", function(req,res){
	console.log("Grading Method Called Successfully");
        //Get all Data from Data base
        Team.find({}, function(err, allTeams){
            if(err){
                console.log(err);
            }else{
                console.log("No Errors to log");
				var counter = 0;
				
            }
        })
})


//app.get("/grade", function(req,res)){
	//
	
	//var counter = 0;
	//var questionArray[4];
	//var teamAnswersArray[4];
	//var correctAnswersArray[4];
	//var team_ID = req.something;
	
	//questionsArray[0] = team_ID.question_ID_01;
	//questionsArray[1] = team_ID.question_ID_02;
	//questionsArray[2] = team_ID.question_ID_03;
	//questionsArray[3] = team_ID.question_ID_04;
	//questionsArray[4] = team_ID.question_ID_05;
	
	//teamAnswersArray[0] = team_ID.answer_01;
	//teamAnswersArray[1] = team_ID.answer_02;
	//teamAnswersArray[2] = team_ID.answer_03;
	//teamAnswersArray[3] = team_ID.answer_04;
	//teamAnswersArray[4] = team_ID.answer_05;
	
	//correctAnswersArray[0] = question_ID_01.correct_option;
	//correctAnswersArray[1] = question_ID_02.correct_option;
	//correctAnswersArray[2] = question_ID_03.correct_option;
	//correctAnswersArray[3] = question_ID_04.correct_option;
	//correctAnswersArray[4] = question_ID_05.correct_option;
	
	
	//read questionArray.correct_option
	
	
	//For (x = 0; x < 5; x++){
	//	if (teamAnswersArray[x] == correctAnswersArray[x]){
	//		counter++;
	//		}
	//	}
	//team_ID.MC_Grade = counter;
//}



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

app.post("/submitQuestion", function(req, res) {
  console.log('req: ', req.body);
      var questions;
    var answers = Object.values(req.body);
      console.log('answers: ', answers);
  
  
  
    Questions.find({}, function(err, allQuestions){
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
