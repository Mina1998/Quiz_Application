function getQuestions() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(JSON.parse(this.responseText));
        }
    }
    request.open("GET", "html_questions.json", true);
    request.send();
}

getQuestions();