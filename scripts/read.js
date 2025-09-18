// Questions database
const questions = [
    {
	type: "Toss-Up",
	subject: "Math",
	text: "What is the value of pi to two decimal places?"
    },
    {
	type: "Bonus",
	subject: "Chemistry",
	text: "Name the element with the atomic number six."
    },
    {
	type: "Toss-Up",
	subject: "Physics",
	text: "What is the unit of force in the SI system?"
    },
    {
	type: "Bonus",
	subject: "Biology",
	text: "Name the organelle responsible for photosynthesis in plant cells."
    },
    {
	type: "Toss-Up",
	subject: "Earth Science",
	text: "What type of rock is formed from the cooling and solidification of magma or lava?"
    },
    {
	type: "Bonus",
	subject: "Chemistry",
	text: "What is the molecular formula for methane gas?"
    }
];

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
    const text = question.text || "";

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
