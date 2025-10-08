import React, { useState, useEffect } from 'react';
import { useQuizLogic } from '../../hooks/useQuizLogic.js';
import { generateQuestions } from '../../services/aiService.js';
import Loader from '../../components/Loader.jsx';
import QuizUI from '../../components/QuizUI.jsx';

const ArtQuizPage = () => {
  // --- Topic-specific values ---
  const topicId = 5; // Unique ID for Art
  const topicName = "Art";

  // --- Logic is identical to other pages ---
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateQuestions(topicId)
      .then(data => { 
        setQuestions(data.questions); 
        setIsLoading(false); 
      })
      .catch(err => { 
        setError("Could not load questions. Please try again later."); 
        setIsLoading(false); 
      });
  }, []);

  const quizLogic = useQuizLogic(questions, topicName);

  if (isLoading) return <Loader message={`Loading ${topicName} Quiz...`} />;
  if (error) return <div className="card error-message"><h2>Oops!</h2><p>{error}</p></div>;
  if (!questions || questions.length === 0) return <div className="card"><p>No questions found.</p></div>;

  return <QuizUI {...quizLogic} questions={questions} topicName={topicName} />;
};

export default ArtQuizPage;