// src/services/geminiService.js
// src/services/geminiService.js

// ... (keep the callOpenAI helper function as is) ...

export const generateQuizQuestions = async (topicName, numQuestions = 5) => {
  // This prompt is now more detailed and strict to prevent errors.
  const prompt = `
    You are a quiz generation assistant. Your task is to create a multiple-choice quiz about ${topicName}.
    Generate exactly ${numQuestions} questions.
    Your entire response must be a single, valid JSON array of objects.
    Each object must have three keys: "questionText", "options", and "correctOptionIndex".
    - "questionText" must be a string containing the question.
    - "options" must be an array of exactly 4 strings. Each string must be a unique and non-empty potential answer.
    - "correctOptionIndex" must be the zero-based index (0, 1, 2, or 3) corresponding to the correct answer in the "options" array.
    
    Example format:
    [
      {
        "questionText": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correctOptionIndex": 2
      }
    ]

    Do not include any text, markdown formatting like \`\`\`json, or explanations outside of the main JSON array.
  `;

  try {
    const responseString = await callOpenAI(prompt);
    // Clean up the response in case the AI wraps it in markdown
    const cleanedString = responseString.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleanedString);

    // Data validation to ensure the AI followed instructions
    if (!Array.isArray(questions) || questions.length === 0 || !questions[0].options) {
      throw new Error("AI returned data in an unexpected format.");
    }
    
    return questions;
  } catch (error) {
    console.error("Failed to generate or parse quiz questions:", error);
    return [{
      questionText: "Could not load questions due to an AI error. Please try another topic.",
      options: ["Go Back", "-", "-", "-"],
      correctOptionIndex: 0
    }];
  }
};


// ... (keep your generateFeedbackFromGemini function as is) ...
// --- Helper function to pick a random message ---
const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

// --- Pools of varied feedback messages ---
const overallFeedbackMessages = {
  perfect: ["Outstanding! A perfect score. Your mastery of this topic is impressive.", "Flawless victory! You've clearly mastered this subject. Amazing work.", "100%! You didn't miss a single one. Incredible performance."],
  strong: ["Great job! You have a strong grasp of the material.", "Excellent work! Your knowledge is solid with just a few tricky spots.", "A very strong performance. You're well on your way to becoming an expert."],
  good: ["Good effort! You've got a solid foundation to build upon.", "Nice work! You're getting the hang of it. Keep reviewing the tough questions.", "You're on the right track. A little more practice will make a big difference."],
  needsWork: ["A good starting point. Every expert was once a beginner.", "Thanks for giving it a shot! Reviewing your answers is the best way to learn.", "You've taken the first step. Keep learning and you'll see improvement quickly."]
};

const questionFeedbackMessages = {
  fastCorrect: ["Excellent! You answered correctly and very quickly.", "Perfect and fast! You knew this one instantly.", "Quick, and correct. Flawless execution."],
  slowCorrect: ["Correct! You took your time to ensure the right answer. Great focus.", "Well done. Deliberate and accurate.", "Patience paid off with a correct answer. Nicely done."],
  avgCorrect: ["Spot on! A correct answer in a good amount of time.", "Correct! Solid performance on this question.", "That's the one. Good job."],
  fastIncorrect: ["A bit too quick on this one. It's easy to misread when moving fast.", "Not quite. Sometimes speed can lead to a simple mistake.", "Incorrect. Take a moment to read the question carefully next time."],
  slowIncorrect: ["This was a tough one. It's a great topic to review.", "Incorrect. This question seems to be a challenge, which makes it a perfect learning opportunity.", "Don't worry, tricky questions like this are how we learn the most."],
  avgIncorrect: ["Not quite. This is a good opportunity to learn from the explanation.", "Incorrect. Every mistake is a step towards understanding.", "That wasn't it, but now you know the right answer for next time."]
};

export const generateFeedbackFromGemini = (performanceReport) => {
  const FAST_THRESHOLD = 5;
  const SLOW_THRESHOLD = 15;

  const finalScore = performanceReport?.finalScore || '0/0';
  const [score, total] = finalScore.split('/').map(Number);
  const accuracy = total > 0 ? (score / total) * 100 : 0;
  
  let overallFeedback = '';
  if (accuracy === 100) overallFeedback = getRandomMessage(overallFeedbackMessages.perfect);
  else if (accuracy >= 75) overallFeedback = getRandomMessage(overallFeedbackMessages.strong);
  else if (accuracy >= 50) overallFeedback = getRandomMessage(overallFeedbackMessages.good);
  else overallFeedback = getRandomMessage(overallFeedbackMessages.needsWork);

  const resultsArray = performanceReport?.resultsArray || [];
  const questionFeedback = resultsArray.map(result => {
    const time = result.timeTaken;
    let category;
    if (result.verdict === "Correct") {
      if (time < FAST_THRESHOLD) category = 'fastCorrect';
      else if (time > SLOW_THRESHOLD) category = 'slowCorrect';
      else category = 'avgCorrect';
    } else {
      if (time < FAST_THRESHOLD) category = 'fastIncorrect';
      else if (time > SLOW_THRESHOLD) category = 'slowIncorrect';
      else category = 'avgIncorrect';
    }
    return { feedback: getRandomMessage(questionFeedbackMessages[category]) };
  });

  return Promise.resolve({ overallFeedback, questionFeedback });
};

// ... your getExplanationFromGemini function remains the same ...
export const getExplanationFromGemini = async (question, correctAnswer, incorrectAnswer) => {
  // ... your existing API call logic ...
};