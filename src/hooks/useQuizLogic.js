import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useQuizLogic = (questions, topicName) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timings, setTimings] = useState({});
  const [timer, setTimer] = useState(15); // Add a visual timer state
  const questionStartTimeRef = useRef(null);

  useEffect(() => {
    questionStartTimeRef.current = Date.now(); // Set initial start time
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (currentIndex >= questions.length) return; // Stop timer when quiz is done
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleNext(); // Auto-advance when timer runs out
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, questions]);

  const handleAnswer = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: optionIndex });
  };

  const handleNext = useCallback(() => {
    const endTime = Date.now();
    const duration = parseFloat(((endTime - questionStartTimeRef.current) / 1000).toFixed(2));
    const newTimings = { ...timings, [currentIndex]: duration };

    if (currentIndex < questions.length - 1) {
      setTimings(newTimings);
      setCurrentIndex(currentIndex + 1);
      questionStartTimeRef.current = Date.now();
      setTimer(15); // Reset visual timer
    } else {
      navigate('/results', { state: { questions, userAnswers, timings: newTimings, topicName } });
    }
  }, [currentIndex, questions, userAnswers, timings, navigate, topicName]);
  
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); }

  return { currentIndex, userAnswers, timer, handleAnswer, handleNext, handlePrev };
};