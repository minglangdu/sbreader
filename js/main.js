// Import your question reading logic
// (If you're using modules, you'd use `import { readQuestion } from './reading.js'`)
// But for now, we assume `readQuestion` is in global scope

// Sample questions — in production, move this to a separate JSON file
const questionsJson = [
    {
        type: "Toss-Up",
        subject: "Physics",
        text: "What is the unit of force in the SI system?"
    },
    {
        type: "Bonus",
        subject: "Biology",
        text: "Name the organelle responsible for photosynthesis."
    }
];

// Default reading speed (syllables per second)
const defaultSpeed = 2;

// Wait until DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("newQuestionBtn");

    button.addEventListener("click", () => {
        readQuestion(defaultSpeed, questionsJson);
    });

    // Optional: auto-read on load
    // readQuestion(defaultSpeed, questionsJson);
});