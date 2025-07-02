// Your existing questions
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

function readQuestion(readingSpeed, questionsJson) {
    const randomIndex = Math.floor(Math.random() * questionsJson.length);
    const question = questionsJson[randomIndex];

    const type = question.type || "Unknown Type";
    const subject = question.subject || "Unknown Subject";
    const text = question.text || "";

    // Set type and subject
    document.getElementById("questionType").textContent = `Type: ${type}`;
    document.getElementById("questionSubject").textContent = `Subject: ${subject}`;

    const syllables = [];
    for (let i = 0; i < text.length; i += 3) {
        syllables.push(text.slice(i, i + 3));
    }

    const intervalMs = 1000 / readingSpeed;

    let i = 0;
    const questionTextDiv = document.getElementById("questionText");
    questionTextDiv.textContent = ""; // Clear previous

    const interval = setInterval(() => {
        if (i >= syllables.length) {
            clearInterval(interval);
            return;
        }
        questionTextDiv.textContent += syllables[i];
        i++;
    }, intervalMs);
}

// Wait for the DOM to load before adding event listener
window.onload = () => {
    const button = document.getElementById("newQuestionBtn");
    button.addEventListener("click", () => {
        readQuestion(2, questionsJson); // adjust reading speed if needed
    });
};