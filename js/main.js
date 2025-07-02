// Import your question reading logic
// (If you're using modules, you'd use `import { readQuestion } from './reading.js'`)
// But for now, we assume `readQuestion` is in global scope
import { readQuestion } from './reading.js'

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
    }
];

window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("newQuestionBtn");
    const speedSlider = document.getElementById("speedSlider");
    const speedDisplay = document.getElementById("speedDisplay");

    // Update speed display when slider moves
    speedSlider.addEventListener("input", () => {
        speedDisplay.textContent = speedSlider.value;
    });

    // On button click, read question with current speed
    button.addEventListener("click", () => {
        const readingSpeed = Number(speedSlider.value);
        readQuestion(readingSpeed, questions);
    });

    // Optional: trigger first question on page load
    readQuestion(Number(speedSlider.value), questions);
});