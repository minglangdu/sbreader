const fs = require('fs');

// Load questions from JSON file
const questionsJson = JSON.parse(fs.readFileSync('./questions.json', 'utf8'));

// Call function with desired reading speed (e.g., 2 syllables/sec)
readQuestion(2, questionsJson);