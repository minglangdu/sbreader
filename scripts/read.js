/*-- Global Variables --*/
const usedSets = 1;
const sets = [-1, 17, 15, 17];
var questions = [];

let currentInterval = null; // To keep track of current reading interval

var randomIndex = 0;

/*--                  --*/


// this function is entirely ai-generated lol
function ankiConnectInvoke(action, version, params = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('Failed to connect to AnkiConnect'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });
        xhr.open('POST', 'http://localhost:8765');
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

async function addCard() {
    var cur = questions[randomIndex];
    var front = cur["subject"] + " " + cur["type"] + " " + cur["content"];
    var back = cur["answer"];
    var note = {
        deckName: "Science Bowl",
        modelName: "Basic (type in the answer)",
        fields: {Front: front, Back: back},
        tags: ["automated"]
    };
    console.log(note);
    try {
        const result = await ankiConnectInvoke("addNote", 6, {note});
    } catch (e) {
        document.getElementById("AnkiBtn").disabled = true;
    }
}

function getQuestions() {
    var selectedSet = document.getElementById("SetInput").value;
    var selectedRound = document.getElementById("RoundInput").value;
    if (selectedSet > 0 && selectedSet <= usedSets
        && selectedRound <= sets[selectedSet] && selectedRound > 0
    ) {
        document.getElementById("newQuestionBtn").disabled = false;
        fetch('./packets/set' + selectedSet + '/round' + selectedRound + '.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
        })
        .catch(error => console.error('Error fetching JSON:', error));
    } else {
        document.getElementById("newQuestionBtn").disabled = true;
    }
}

function readQuestion(readingSpeed, questionsArray) {
    // Clear any existing interval
    if (currentInterval) {
	clearInterval(currentInterval);
    }
    const buzz = document.getElementById("BuzzBtn");
    buzz.disabled = false;
    reading = true;

    const answerDiv = document.getElementById("questionAnswer");
    answerDiv.textContent = "";

    randomIndex = Math.floor(Math.random() * questionsArray.length);
    const question = questionsArray[randomIndex];

    const type = question.type || "Unknown Type";
    const subject = question.subject || "Unknown Subject";
    const text = question.content || "";

    // Set type and subject
    document.getElementById("questionType").textContent = `Type: ${type}`;
    document.getElementById("questionSubject").textContent = `Subject: ${subject}`;

    // Break text into chunks (you can adjust this logic)
    const words = text.split(' ');
    const chunks = [];

    // Group words into chunks of 1-2 words for more natural reading
    for (let i = 0; i < words.length; i++) {
	if (words[i].length > 6) {
	    // Long words get their own chunk
	    chunks.push(words[i]);
	} else if (i < words.length - 1 && words[i].length + words[i + 1].length < 8) {
	    // Combine short words
	    chunks.push(words[i] + ' ' + words[i + 1]);
	    i++; // Skip the next word since we combined it
	} else {
	    chunks.push(words[i]);
	}
    }

    const intervalMs = 1000 / readingSpeed;

    let i = 0;
    const questionTextDiv = document.getElementById("questionText");
    questionTextDiv.textContent = ""; // Clear previous

    currentInterval = setInterval(() => {
	if (i >= chunks.length) {
	    clearInterval(currentInterval);
	    currentInterval = null;
	    return;
	}
	if (document.getElementById("BuzzBtn").disabled == false) {
	    if (i === 0) {
		questionTextDiv.textContent = chunks[i];
	    } else {
		questionTextDiv.textContent += ' ' + chunks[i];
	    }
	    i++;
	}
    }, intervalMs);
}

function showAnswer() {
    const answerDiv = document.getElementById("questionAnswer");
    answerDiv.textContent = questions[randomIndex]["answer"];
}

function Buzz() {
    reading = false;
    document.getElementById("BuzzBtn").disabled = true;
}

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("newQuestionBtn");
    const button2 = document.getElementById("showAnswerBtn");
    const buzz = document.getElementById("BuzzBtn");
    const speedSlider = document.getElementById("speedSlider");
    const speedDisplay = document.getElementById("speedDisplay");
    const set = document.getElementById("SetInput");
    const round = document.getElementById("RoundInput");
    const anki = document.getElementById("AnkiBtn");

    // Initialize speed display
    speedDisplay.textContent = speedSlider.value;

    // Update the speed display text in real time
    speedSlider.addEventListener("input", () => {
	speedDisplay.textContent = speedSlider.value;
    });

    // When button is clicked, get current slider value and read question
    button.addEventListener("click", () => {
	const readingSpeed = Number(speedSlider.value);
	readQuestion(readingSpeed, questions);
    });

    button2.addEventListener("click", () => {showAnswer();});
    buzz.addEventListener("click", () => {Buzz();});

    set.addEventListener("input", () => {
        getQuestions();
    });
    round.addEventListener("input", () => {
        getQuestions();
    });
    anki.addEventListener("click", () => {
        addCard();
    });
});
