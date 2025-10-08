import React from 'react';
import { Link } from 'react-router-dom';
import styles from './QuizListPage.module.css';

// Each topic now has a simple, static 'route'.
// The 'id' is the category number for the Open Trivia Database API.
const topics = [
  { name: 'Sports',    id: 21, icon: '⚽️', route: '/quiz/sports' },
  { name: 'History',   id: 23, icon: '📜', route: '/quiz/history' },
  { name: 'Computers', id: 18, icon: '💻', route: '/quiz/computers' },
  { name: 'Art',       id: 25, icon: '🎨', route: '/quiz/art' },
];

const QuizListPage = () => {
  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.hero}>
        <h1>Choose Your Challenge</h1>
        <p>Select a topic below to test your knowledge.</p>
      </div>
      <div className={styles.topicGrid}>
        {topics.map((topic) => (
          // The Link now points to the simple, static route.
          <Link to={topic.route} key={topic.name} className={styles.topicCard}>
            <div className={styles.topicIcon}>{topic.icon}</div>
            <h3 className={styles.topicName}>{topic.name}</h3>
            <div className={styles.goArrow}>→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizListPage;