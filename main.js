// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");
let currentQuestion = 0;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let rightAnswers = 0, wrongAnswers = 0, countdownInterval;
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countdownDiv = document.querySelector(".countdown");

function getQuestions() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function (e) {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsNumber = Object.keys(questionsObject).length;

            createBullets(questionsNumber);
            addQuestionData(questionsObject[currentQuestion]);
            countdown(120);
            submitButton.onclick = function () {
                let currentQuestionObj = questionsObject[currentQuestion];
                let rightAnswer = currentQuestionObj["right_answer"];
                checkAnswer(rightAnswer);
                removeOldQuestion();
                if (currentQuestion == questionsNumber-1) {
                    submitButton.classList.add("finish");
                    showResults(questionsNumber);
                } else {
                    currentQuestion++;
                    countdown(120);
                    addQuestionData(questionsObject[currentQuestion], questionsNumber);
                    let bulletsArray = Array.from(document.querySelectorAll(".bullets .spans span"));
                    bulletsArray[currentQuestion].classList.add("active");
                }
            }
        }
    }
    request.open("GET", "html_questions.json", true);
    request.send();
}

// Function to Create Bullets and Set Questions Count
function createBullets(num) {
    countSpan.textContent = num;
    for (let i = 0; i < num; i++){
        let span = document.createElement("span");
        if (i == 0) {
            span.classList.add("active");
        }
        bulletsSpans.appendChild(span);
    }
}

// Function to Add Question Data to the Page
function addQuestionData(questionObject) {
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(questionObject["title"]));
    quizArea.appendChild(questionTitle);
    let numberOfAnswers = Object.keys(questionObject).length - 2; // The 2 Stands for the Title of the question and the right answer

    for (let i = 1; i <= numberOfAnswers; i++) {
        let div = document.createElement("div");
        div.classList.add("answer");

        let input = document.createElement("input");
        input.type = "radio";
        input.name = "question";
        input.id = `answer-${i}`;
        input.dataset.answer = questionObject[`answer_${i}`];
        if (i == 1) {
            input.checked = true;
        }

        let label = document.createElement("label");
        label.appendChild(document.createTextNode(questionObject[`answer_${i}`]));
        label.htmlFor = `answer-${i}`; // NEW NOTE (We use htmlFor for the for label attribute)

        div.appendChild(input);
        div.appendChild(label);
        answersArea.appendChild(div);
    }
}

// Function to Check if the Chosen answer is right or wrong
function checkAnswer(rightAnswer) {
    let radioButtons = Array.from(document.getElementsByName("question"));
    radioButtons.forEach((radio) => {
        if (radio.checked) {
            if (radio.dataset.answer === rightAnswer) {
                rightAnswers +=1;
            } else {
                wrongAnswers +=1;
            }
        }
    })
}

// Function tod Remove The Previous Question
function removeOldQuestion() {
    let questionTitle = document.querySelector(".quiz-area h2");
    questionTitle.remove();
    let answers = Array.from(document.querySelectorAll(".answers-area div"));
    for(let i = 0 ; i < answers.length ; i++) {
        answers[i].remove();
    }
}

// Function to Show the Final Result
function showResults(questionsNumber) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    let text = document.createTextNode(`You Answered ${rightAnswers} Questions out of ${questionsNumber}`);
    results.appendChild(text);
}

// Function To make a Timer for the Question
function countdown(duration) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        countdownDiv.innerHTML = `${minutes} : ${seconds}`;
        if (--duration < 0) {
            clearInterval(countdownInterval);
            submitButton.click();
        }
    }, 1000);
}

// Run The Main Function
getQuestions();