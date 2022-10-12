// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

// sound effects
var sfxRight = new Audio('assets/sfx/correct.wav');
var sfxWrong = new Audio('assets/sfx/incorrect.wav');

var questions = [
    {
      title: 'Commonly used data types DO NOT include:',
      choices: ['strings', 'booleans', 'alerts', 'numbers'],
      answer: 'alerts',
    },
    {
      title: 'The condition in an if / else statement is enclosed within ____.',
      choices: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
      answer: 'parentheses',
    },
    {
      title: 'Arrays in JavaScript can be used to store ____.',
      choices: [
        'numbers and strings',
        'other arrays',
        'booleans',
        'all of the above',
      ],
      answer: 'all of the above',
    },
    {
      title:
        'String values must be enclosed within ____ when being assigned to variables.',
      choices: ['commas', 'curly brackets', 'quotes', 'parentheses'],
      answer: 'quotes',
    },
    {
      title:
        'A very useful tool used during development and debugging for printing content to the debugger is:',
      choices: ['JavaScript', 'terminal / bash', 'for loops', 'console.log'],
      answer: 'console.log',
    },
  ];



function startQuiz() {
    // hide start screen after pressing button
    var startScreenEl = document.getElementById('start-screen');
    startScreenEl.setAttribute('class', 'hide');

    // un-hide questions section
    questionsEl.removeAttribute('class');


    //start timer (high)
    timerId = setInterval(clockTick, 600,000);
//you need to declare a var named timerId. You will also need to use setInterval and clockTick

    //show starting time (high)
    timerEl.textContent = time;

    getQuestion();
}

function getQuestion() { //this function is going to get the data from the questions array
    // get current question object from array
    var currentQuestion = questions[currentQuestionIndex]

    // update title with current question
    var titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;

    // clear out any old question choices
    choicesEl.innerHTML = ''; //Study this later

    // create a for loop that creates the choice elements
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        // create new button for each choice
        var buttonEl = document.createElement('button');
        buttonEl.setAttribute('class', 'choice');
        buttonEl.setAttribute('value', currentQuestion.choices[i]);
        // attach click event listener to each choice
        buttonEl.addEventListener('click', questionClick);
        //.setAttribute (set a class="choice")
        // display on the page
       buttonEl.textContent = currentQuestion.choices[i];

        // display on the page
        choicesEl.appendChild(buttonEl);
        //.textContent

    }
}

function questionClick(event) {
    var buttonEl = event.target;

    // if the clicked element is not a choice button, do nothing.
    if (!buttonEl.matches('.choice')) {
        return;
    }

    // create if else function to check if user guessed right or wrong
    //conditional statement that checks if the clicked choice button's value is not the same as the questions[currentQuestionIndex]'s answer
    if (buttonEl.value !== questions[currentQuestionIndex].answer) { 
        //incorrect answer scenario
        // play "wrong" sound effect
        time -= 5;
        if (time < 0) {
            time = 0;
        }
        timerEl.textContent = time;
        // wrong feedback on page for half a second
        feedbackEl.textContent = 'Wrong!';
    } else {
        feedbackEl.textContent = 'Right!';
     
    feedbackEl.setAttribute('class', 'feedback');    
    setTimeout(function() {
        feedbackEl.setAttribute('class', 'feedback hide');
    }, 1000);

    currentQuestionIndex++;
        // move to next question
    
    // check if we've run out of questions
    if (time <= 0 || currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();

    }
}
}


function quizEnd() {
    // stop timer
    clearInterval(timerId);

    // show end screen
    var endScreenEl = document.getElementById('end-screen');
    endScreenEl.removeAttribute('class');

    // show final score
    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    // hide questions section
    questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
    // update time
    time--;
    timerEl.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}


function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();

    // make sure value wasn't empty
    if (initials !== '') {

        //JSON.parse
        // get saved scores from localstorage (highscores), or if not any, set to empty array
        var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials
        };
        

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem('highscores', JSON.stringify(highscores));

        // redirect to next page
        window.location.href = 'highscores.html';
    }
}

function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === 'Enter') {
        saveHighscore();
    }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
