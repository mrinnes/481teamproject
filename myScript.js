/* 
Dean Parrish, 3/4/19
 */
var thisQuiz = document.getElementById('quiz');
var quizResults = document.getElementById('results');
var submitButton = document.getElementById('submit');
  
    var questions = [ //marks array
    { //marks object
        question: "Question 1",
        answers: {
            a: 'correct',
            b: 'answer',
            c: 'answer',
            d: 'answer'
        },
        correctAnswer: 'a'
    },
    { //marks object
        question: "Question 2",
        answers: {
            a: 'answer',
            b: 'correct',
            c: 'answer',
            d: 'answer'
        },
        correctAnswer: 'b'
    },
        { //marks object
        question: "Question 3",
        answers: {
            a: 'answer',
            b: 'answer',
            c: 'correct',
            d: 'answer'
        },
        correctAnswer: 'c'
    },
        { //marks object
        question: "Question 4",
        answers: {
            a: 'answer',
            b: 'answer',
            c: 'answer',
            d: 'correct'
        },
        correctAnswer: 'd'
    }
];


generateQuiz(questions, thisQuiz, quizResults, submitButton);

function printQuestions(questions, thisQuiz){
		//array for output of questions and answers
        var output = [];
        //array for answers
        var answers = [];

        for(var i = 0; i < questions.length; i++){
        	//reset
            answers = [];

            for(letter in questions[i].answers){
            //make radio buttons for answers
                answers.push(
                    '<label>'
                        + '<input type="radio" name="question'+i+'" value="'+letter+'">'
                        + letter + ': '
                        + questions[i].answers[letter]
                    + '</label>'
                );
            }

            //push question and answers to output
            output.push(
                '<div class="question">' + questions[i].question + '</div>' 
                + '<div class="answers">' + answers.join(', ') + '</div>'
            );
        }
		//join and print
        thisQuiz.innerHTML = output.join('');
    }
    
    function printResults(questions, thisQuiz, quizResults){
        // gather answer containers from our quiz
        var userAnswers = thisQuiz.querySelectorAll('.answers');
        //finds by class using dot
        //can find by id using #
        //can find elements by element type
        
        // keep track of user's answers
        var userAnswer = '';
        var totalCorrect = 0;
        var incorrectResults = [];
        
        for(var i = 0; i < questions.length; i++){
			//find answer
            userAnswer = (userAnswers[i].querySelector('input[name=question'+i+']:checked') || {}).value;
            
            //if correct
            if(userAnswer === questions[i].correctAnswer){
            	//+1 to totalCorrect
                totalCorrect++;
            } else {
            	incorrectResults.push(questions[i].question + ' correct answer: ' + questions[i].correctAnswer);
            	
            }
        }
		//print totalCorrect
        quizResults.innerHTML = totalCorrect + ' / ' + questions.length + ' correct' + '<br />' + incorrectResults.join('<br />');
        
    }

function generateQuiz(questions, thisQuiz, quizResults, submitButton){

    printQuestions(questions, thisQuiz);
    
    //submit onClick to show results
    submitButton.onclick = function(){
        printResults(questions, thisQuiz, quizResults);
    }
    //need anonymous function, else will call printResults immediately

}