import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuizLogic } from '../../hooks/useQuizLogic.js';
import { generateQuestions } from '../../services/aiService.js';
import Loader from '../../components/Loader.jsx';
import QuizUI from '../../components/QuizUI.jsx';

const QuizPage = () => {
  const { topicName, category } = useParams(); // Get topic info from the URL
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateQuestions(category)
      .then(data => {
        setQuestions(data.questions);
        setIsLoading(false);
      })
      .catch(err => {
        setError("Could not load questions. The API might be busy. Please try again later.");
        setIsLoading(false);
      });
  }, [category]);

  // The reusable hook provides all the state and handlers for the quiz
  const quizLogic = useQuizLogic(questions, topicName);

  if (isLoading) return <Loader message={`Loading ${topicName} Quiz...`} />;
  if (error) return <div className="card error-message"><h2>Oops!</h2><p>{error}</p></div>;
  if (!questions || questions.length === 0) return <div className="card"><p>No questions found for this topic.</p></div>;

  // The reusable UI component handles all the rendering
  return <QuizUI {...quizLogic} questions={questions} topicName={topicName} />;
};

export default QuizPage;