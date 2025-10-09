// src/pages/quizzes/QuizPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestions } from '../../services/aiService';
import Loader from '../../components/Loader';
import QuizUI from '../../components/QuizUI';

const TIME_PER_QUESTION = 30;

const QuizPage = ({ topicName }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timings, setTimings] = useState([]);
  const [timer, setTimer] = useState(TIME_PER_QUESTION);
  const navigate = useNavigate();
  const timerRef = useRef(null);

// In src/pages/quizzes/QuizPage.jsx

useEffect(() => {
  let isMounted = true;
  setIsLoading(true);

  // You MUST use .then() because the function is now async
  generateQuestions(topicName)
    .then(generatedQuestions => {
      if (isMounted) {
        setQuestions(generatedQuestions);
        setIsLoading(false);
      }
    });

  return () => { isMounted = false; };
}, [topicName]);
  // --- END OF FIX ---

  // Timer effect
  useEffect(() => {
    if (isLoading || userAnswers[currentIndex] !== undefined) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(TIME_PER_QUESTION);

    timerRef.current = setInterval(() => setTimer(prev => prev - 1), 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isLoading]);

  // Effect for when timer runs out
  useEffect(() => {
    if (timer === 0) handleNext(true);
  }, [timer]);

  const handleAnswer = (optionIndex) => {
    if (userAnswers[currentIndex] !== undefined) return;

    clearInterval(timerRef.current);
    const timeTaken = TIME_PER_QUESTION - timer;
    const newTimings = [...timings];
    newTimings[currentIndex] = timeTaken;
    setTimings(newTimings);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = (isTimeUp = false) => {
    if (isTimeUp && userAnswers[currentIndex] === undefined) {
      const newAnswers = [...userAnswers];
      newAnswers[currentIndex] = null;
      setUserAnswers(newAnswers);
      const newTimings = [...timings];
      newTimings[currentIndex] = TIME_PER_QUESTION;
      setTimings(newTimings);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setUserAnswers(currentAnswers => {
        navigate('/results', {
          state: { questions, userAnswers: currentAnswers, timings, topicName }
        });
        return currentAnswers;
      });
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (isLoading) return <Loader message={`Loading ${topicName} Quiz...`} />;
  if (!questions || questions.length === 0) return <div>Could not load quiz. Please try again.</div>;

  return (
    <QuizUI
      topicName={topicName}
      questions={questions}
      currentIndex={currentIndex}
      userAnswers={userAnswers}
      timer={timer} 
      handleAnswer={handleAnswer}
      handleNext={() => handleNext(false)}
      handlePrev={handlePrev}
    />
  );
};

export default QuizPage;