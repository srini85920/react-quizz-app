import React, { useState, useEffect } from 'react';
import { generateQuestions } from '../../services/aiService.js';
import Loader from '../../components/Loader.jsx';
import uizPage from './QuizPage.jsx';
// Or your QuizUI component

const ComputersQuizPage = () => {
  // We don't need topicId anymore, topicName is what matters
  const topicName = "Computer Science";
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- THIS IS THE FIX ---
  useEffect(() => {
    // 1. Call generateQuestions with the topic NAME, not the ID
    generateQuestions(topicName)
      .then(data => {
        // 2. The data IS the array of questions, so we use it directly
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError("Could not load questions. Please try again later.");
        setIsLoading(false);
      });
  }, []); // The empty array ensures this runs only once

  // The 'useQuizLogic' hook might need to be removed or adapted
  // depending on where your quiz logic (handleNext, etc.) lives.
  // For now, let's focus on loading the questions.

  if (isLoading) return <Loader message={`Loading ${topicName} Quiz...`} />;
  if (error) return <div className="card error-message"><h2>Oops!</h2><p>{error}</p></div>;
  if (!questions || questions.length === 0) return <div className="card"><p>No questions found.</p></div>;

  // This part assumes you have a component (like the reusable QuizPage or QuizUI)
  // that can accept the questions and handle the quiz flow.
  // Replace 'QuizPage' with your actual quiz display component.
  return <QuizPage topicName={topicName} initialQuestions={questions} />;
};

export default ComputersQuizPage;