import React from 'react';
import styles from './QuizUI.module.css';

const QuizUI = ({ topicName, questions, currentIndex, userAnswers, timer, handleAnswer, handleNext, handlePrev }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.quizContainer}>
        <h2>Loading Quiz...</h2>
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className={styles.quizContainer}>
        <p>Waiting for the next question...</p>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className={`${styles.quizContainer} animate-fade-in`}>
      <div className={styles.header}>
        <h2>{topicName} Quiz</h2>
        <div className={styles.meta}>
          <span className={styles.questionCount}>Question {currentIndex + 1} of {questions.length}</span>
          <span className={styles.timer}>Time Left: {timer}s</span>
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className={styles.questionWrapper}>
        <h3 className={styles.questionText}>{currentQuestion.questionText}</h3>
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionBtn} ${userAnswers[currentIndex] === index ? styles.selected : ''}`}
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.navigation}>
        <button 
          onClick={handlePrev} 
          className={`${styles.navButton} ${styles.prevButton}`}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext} 
          className={`${styles.navButton} ${styles.nextButton}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizUI;
