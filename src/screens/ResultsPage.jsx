import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { generateFeedbackFromGemini, getExplanationFromGemini } from '../services/geminiService.js';
import Loader from '../components/Loader.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import styles from './ResultsPage.module.css';
import { generateFeedback, getLocalExplanation } from'../services/aiService.js';

const ResultsPage = () => {
  const location = useLocation();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [explanation, setExplanation] = useState({ text: '', index: null });
  const [isExplainLoading, setIsExplainLoading] = useState(false);

  if (!location.state) 
  const { questions, userAnswers, timings, topicName } = location.state;

  const performanceReport = useMemo(() => {
    let score = 0;
    const detailedResults = questions.map((q, index) => {
      const isCorrect = userAnswers[index] === q.correctOptionIndex;
      if (isCorrect) score++;
      return { question: q.questionText, verdict: isCorrect ? "Correct" : "Incorrect", timeTaken: timings[index] || 0 };
    });
    return { topic: topicName, finalScore: `${score}/${questions.length}`, resultsArray: detailedResults };
  }, [questions, userAnswers, timings, topicName]);


  useEffect(() => {
    const generatedFeedback = generateFeedback(performanceReport);
    setFeedback(generatedFeedback);
    setIsLoading(false);
    //a incase any clean ups 
  }, [performanceReport]);

  const handleExplainClick = (result, index) => {
    const question = questions[index];
    const incorrectAnswer = userAnswers[index] !== null ? question.options[userAnswers[index]] : "No answer selected";
    const correctAnswer = question.options[question.correctOptionIndex];
    
    const res = getLocalExplanation(result.question, correctAnswer, incorrectAnswer);
    
    setExplanation({ text: res.explanation, index });
  };
  
  const scoreNum = parseInt(performanceReport.finalScore.split('/')[0]);

  return (
    <div className={`${styles.resultsContainer} animate-fade-in`}>
      <h1 className={styles.title}>Results for {topicName}</h1>
      {isLoading ? <Loader message="Gemini is analyzing your performance..." /> : (
        <>
          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}><span>Score</span><strong>{performanceReport.finalScore}</strong></div>
                <div className={styles.statItem}><span>Accuracy</span><strong>{((scoreNum / questions.length) * 100).toFixed(1)}%</strong></div>
              </div>
              <div className={styles.overallFeedback}>
                <h4>✨ Overall AI Feedback</h4>
                <p>"{feedback?.overallFeedback}"</p>
              </div>
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.chartContainer}>
                <h4>Performance Breakdown</h4>
// In src/pages/quizzes/ResultsPage.jsx

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceReport.resultsArray} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ "var(--border-color)" } vertical={false} />
                  <XAxis dataKey="question" tickFormatter={(tick, index) => `Q${index + 1}`} stroke="var(--secondary-text)" />
                  <YAxis label={{ value: 'Time (s)', angle: -90, position: 'insideLeft', fill: 'var(--secondary-text)' }} stroke="var(--secondary-text)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Bar dataKey="timeTaken" radius={[4, 4, 0, 0]}>
                    {performanceReport.resultsArray.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.verdict === 'Correct' ? 'var(--correct-color)' : 'var(--incorrect-color)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className={styles.detailsSection}>
            <h3>Per-Question AI Analysis</h3>
            <div className={styles.detailsGrid}>
              {performanceReport.resultsArray.map((result, index) => (
                <div key={index} className={styles.detailCard}>
                  <p><strong>Q{index + 1}:</strong> {result.question}</p>
                  <p className={result.verdict === 'Correct' ? styles.correct : styles.incorrect}>Verdict: {result.verdict} ({result.timeTaken}s)</p>
                  <p className={styles.aiInsight}><strong>AI Insight:</strong> "{feedback?.questionFeedback?.[index]?.feedback}"</p>
                  {result.verdict === 'Incorrect' && (
                    <div className={styles.explainContainer}>
                      <button onClick={() => handleExplainClick(result, index)} disabled={isExplainLoading && explanation.index === index} className={styles.explainBtn}>
                        {isExplainLoading && explanation.index === index ? 'Thinking...' : 'Explain My Mistake'}
                      </button>
                    </div>
                  )}
                  {explanation.index === index && explanation.text && (
                    <p className={styles.aiExplanation}><strong>Explanation:</strong> {explanation.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className={styles.actions}>
        <Link to="/quiz" className="button">Choose Another Topic</Link>
        <Link to="/dashboard" className="button">View Dashboard</Link>
      </div>
    </div>
  );
};
export default ResultsPage;
