// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let currentQuestion = 0;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let rightAnswers = 0, wrongAnswers = 0;
let submitButton = document.querySelector(".submit-button");

function getQuestions() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsNumber = Object.keys(questionsObject).length;

            createBullets(questionsNumber);
            addQuestionData(questionsObject[currentQuestion], questionsNumber);
            submitButton.onclick = function () {
                let currentQuestionObj = questionsObject[currentQuestion];
                let rightAnswer = currentQuestionObj["right_answer"];
                let radioButtons = Array.from(document.querySelectorAll(".answers-area input"));
                radioButtons.forEach((radio) => {
                    if (radio.checked) {
                        if (radio.dataset.answer === rightAnswer) {
                            rightAnswers +=1;
                            console.log(rightAnswers);
                        } else {
                            wrongAnswers +=1;
                        }
                    }
                })
                currentQuestion +=1;
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
function addQuestionData(questionObject, questionsCounts) {
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

getQuestions();