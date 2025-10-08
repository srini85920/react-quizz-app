// This service uses a new, more reliable API: The Trivia API

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export const generateQuestions = async (category) => {
  const cacheKey = `quiz-questions-${category}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    console.log("Loading questions from cache...");
    return JSON.parse(cachedData);
  }

  try {
    console.log("Fetching new questions from The Trivia API...");
    // The new API URL is simpler
    const response = await fetch(`https://the-trivia-api.com/v2/questions?limit=5&categories=${category}&difficulties=medium`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (!data || data.length === 0) throw new Error('API could not provide questions.');

    const formattedQuestions = data.map((q) => {
      const allOptions = shuffleArray([...q.incorrectAnswers, q.correctAnswer]);
      const correctIndex = allOptions.findIndex(option => option === q.correctAnswer);

      return {
        questionText: q.question.text, // The question text is nested in the new API
        options: allOptions,
        correctOptionIndex: correctIndex,
      };
    });
    
    const questionsToCache = { questions: formattedQuestions };
    localStorage.setItem(cacheKey, JSON.stringify(questionsToCache));
    return questionsToCache;
  } catch (error) {
    console.error("Failed to fetch questions from API:", error);
    throw error;
  }
};