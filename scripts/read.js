// Questions
var questions = [];
const randomNumber = Math.floor(Math.random() * 17) + 1;
console.log('./packets/set1/round' + randomNumber + '.json');
fetch('./packets/set1/round' + randomNumber + '.json')
  .then(response => response.json())
  .then(data => {
      questions = data;
      console.log(questions);
  })
  .catch(error => console.error('Error fetching JSON:', error));

let currentInterval = null; // To keep track of current reading interval

function readQuestion(readingSpeed, questionsArray) {
    // Clear any existing interval
    if (currentInterval) {
	clearInterval(currentInterval);
    }

    const randomIndex = Math.floor(Math.random() * questionsArray.length);
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

	if (i === 0) {
	    questionTextDiv.textContent = chunks[i];
	} else {
	    questionTextDiv.textContent += ' ' + chunks[i];
	}
	i++;
    }, intervalMs);
}

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("newQuestionBtn");
    const speedSlider = document.getElementById("speedSlider");
    const speedDisplay = document.getElementById("speedDisplay");

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
});
