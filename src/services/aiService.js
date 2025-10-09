// src/services/aiService.js

// This service now uses the Open Trivia Database (opentdb.com)

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// 1. Map your friendly topic names to the API's required category IDs
const CATEGORY_ID_MAP = {
  "Sports": 21,
  "History": 23,
  "Computer Science": 18,
  "Art History": 25,
  // You can find more category IDs at https://opentdb.com/api_category.php
};

// 2. The function is now ASYNC because it fetches from the internet
export const generateQuestions = async (topicName, numQuestions = 5) => {
  const categoryId = CATEGORY_ID_MAP[topicName];

  if (!categoryId) {
    console.error(`No category ID found for topic: ${topicName}`);
    return [{
      questionText: `Sorry, the topic "${topicName}" is not configured.`,
      options: ["Go Back", "-", "-", "-"],
      correctOptionIndex: 0
    }];
  }

  // The cache key now includes the topic name to avoid conflicts
  const cacheKey = `quiz-questions-opentdb-${topicName}`;
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`Loading ${topicName} questions from cache...`);
      return JSON.parse(cachedData);
    }

    console.log(`Fetching new questions for ${topicName} from Open Trivia DB...`);
    const response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=${categoryId}&difficulty=easy&type=multiple`);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`API could not provide questions for category ID: ${categoryId}`);
    }

    // 3. Transform the API data into the format your app expects
    const formattedQuestions = data.results.map((q) => {
      // The API returns HTML entities (like &quot;), this decodes them to normal characters
      const decodedQuestion = new DOMParser().parseFromString(q.question, "text/html").documentElement.textContent;
      const decodedCorrectAnswer = new DOMParser().parseFromString(q.correct_answer, "text/html").documentElement.textContent;
      const decodedIncorrectAnswers = q.incorrect_answers.map(ans => new DOMParser().parseFromString(ans, "text/html").documentElement.textContent);
      
      const allOptions = shuffleArray([...decodedIncorrectAnswers, decodedCorrectAnswer]);
      const correctIndex = allOptions.findIndex(option => option === decodedCorrectAnswer);

      return {
        questionText: decodedQuestion,
        options: allOptions,
        correctOptionIndex: correctIndex,
      };
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(formattedQuestions));
    return formattedQuestions;

  } catch (error) {
    console.error("Failed to fetch or process questions:", error);
    return [{
      questionText: `Could not load questions for ${topicName}. Please try again.`,
      options: ["Go Back", "-", "-", "-"],
      correctOptionIndex: 0
    }];
  }
};


const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];

const overallFeedbackMessages = {
  perfect: ["Outstanding! A perfect score. Your mastery of this topic is impressive.", "Flawless victory! You've clearly mastered this subject."],
  strong: ["Great job! You have a strong grasp of the material.", "Excellent work! Your knowledge is solid with just a few tricky spots."],
  good: ["Good effort! You've got a solid foundation to build upon.", "Nice work! You're getting the hang of it. Keep reviewing the tough questions."],
  needsWork: ["A good starting point. Every expert was once a beginner.", "Thanks for giving it a shot! Reviewing your answers is the best way to learn."]
};

const questionFeedbackMessages = {
  fastCorrect: ["Excellent! You answered correctly and very quickly.", "Perfect and fast! You knew this one instantly."],
  slowCorrect: ["Correct! You took your time to ensure the right answer. Great focus.", "Well done. Deliberate and accurate."],
  avgCorrect: ["Spot on! A correct answer in a good amount of time.", "Correct! Solid performance on this question."],
  fastIncorrect: ["A bit too quick on this one. It's easy to misread when moving fast.", "Incorrect. Sometimes speed can lead to a simple mistake."],
  slowIncorrect: ["This was a tough one. It's a great topic to review.", "Incorrect. This question seems to be a challenge, which makes it a perfect learning opportunity."],
  avgIncorrect: ["Not quite. This is a good opportunity to learn from the explanation.", "That wasn't it, but now you know the right answer for next time."]
};

export const generateFeedback = (performanceReport) => {
  const FAST_THRESHOLD = 7;
  const SLOW_THRESHOLD = 20;
  const [score, total] = performanceReport.finalScore.split('/').map(Number);
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
  return { overallFeedback, questionFeedback };
};

export const getLocalExplanation = (question, correctAnswer, incorrectAnswer) => {
  const explanation = `For the question "${question}", your answer "${incorrectAnswer}" was incorrect. The correct answer is "${correctAnswer}".`;
  return { explanation };
};