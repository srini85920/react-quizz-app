import React, { useMemo } from 'react';
import styles from './HomePage.module.css';
import { motion } from 'framer-motion';

const HomePage = () => {
  const history = useMemo(() => JSON.parse(localStorage.getItem('quizHistory')) || [], []);
  const stats = useMemo(() => {
    if (history.length === 0) return { totalQuizzes: 0, avgScore: 0, bestTopic: 'N/A' };
    const totalQuizzes = history.length;
    const totalScore = history.reduce((acc, curr) => {
      const [score, total] = curr.finalScore.split('/');
      return acc + (parseInt(score) / parseInt(total));
    }, 0);
    const avgScore = ((totalScore / totalQuizzes) * 100).toFixed(1);
    const topicScores = {};
    history.forEach(h => {
        if (!topicScores[h.topic]) topicScores[h.topic] = { score: 0, count: 0 };
        const [score, total] = h.finalScore.split('/');
        topicScores[h.topic].score += (parseInt(score) / parseInt(total));
        topicScores[h.topic].count++;
    });
    let bestTopic = 'N/A';
    let maxAvg = 0;
    for(const topic in topicScores){
        const avg = topicScores[topic].score / topicScores[topic].count;
        if(avg > maxAvg){ maxAvg = avg; bestTopic = topic; }
    }
    return { totalQuizzes, avgScore, bestTopic };
  }, [history]);

  return (
    <motion.div 
      className={styles.homeContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.heroSection}>
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Welcome to Your AI Quiz Dashboard
        </motion.h1>
        <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Track your progress, review past quizzes, and challenge yourself with new topics.
        </motion.p>
      </div>
      <h2>Your Overall Statistics</h2>
      <div className={styles.statsGrid}>
        {[
          { label: 'Quizzes Taken', value: stats.totalQuizzes },
          { label: 'Average Score', value: `${stats.avgScore}%` },
          { label: 'Best Topic', value: stats.bestTopic }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
          >
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default HomePage;