var express         = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
open                = require("opn"),
Questions           = require("./models/MultiChoice.js"),
Team                = require("./models/teams.js"),
router              = express.Router();


app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/models"));


mongoose.connect("mongodb://localhost/Icompute",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.post("/submitQuestion", function(req, res) {
  console.log('req: ', req.body);
      var questions;
    var answers = Object.values(req.body);
      //console.log('answers: ', answers);
  
  
  
Questions.find({}, function(err, allQuestions){
	if (err) {
		console.log(err);
	} else {
		questions = allQuestions;
		//console.log('questions: ', allQuestions);
		counter = 0;
		for(i = 0; i < allQuestions.length; i++){
			//console.log('question id: ', allQuestions[i].ID);
			//console.log('question correct answer: ', allQuestions[i].correct_option);
			//console.log('selected answer: ', answers[i]);
			if(allQuestions[i].correct_option === answers[i]){
				console.log(allQuestions[i].ID, ' is correct');
				counter++;
			} else {
				console.log(allQuestions[i].ID, ' is incorrect');
			}
		}
		console.log(counter + " correct answers");
		//Team.SchoolTeamSchema.MC_Grade = counter;
		
	}
});
	
	
      
  res.redirect("/examplemultiplechoice");
});

//app.get("/grade", function(req,res){
//	console.log("Grading Method Called Successfully");
//        //Get all Data from Data base
//        Team.find({}, function(err, allTeams){
//            if(err){
 //               console.log(err);
//            }else{
//                console.log("No Errors to log");
//				var counter = 0;	
 //           }
//       })
//})


app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Icompute Server has Started");
    open('http://localhost:3000');
});



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
