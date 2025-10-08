import React, { useState, useMemo } from 'react';
import styles from './DashboardPage.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const DashboardPage = () => {
  // 1. Fetch all history from localStorage
  const history = useMemo(() => JSON.parse(localStorage.getItem('quizHistory')) || [], []);
  
  // 2. State to track which session is expanded, using its unique date as an ID
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  // 3. Handler to toggle the expanded session
  const handleToggleSession = (sessionId) => {
    setExpandedSessionId(prevId => (prevId === sessionId ? null : sessionId));
  };

  if (history.length === 0) {
    return (
      <div className="card">
        <h2>Dashboard is Empty</h2>
        <p>Your quiz history will appear here once you complete a quiz.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboardContainer} animate-fade-in`}>
      <h1 className={styles.title}>Quiz Dashboard</h1>
      <div className={styles.sessionList}>
        {/* Map over the history array, showing the newest sessions first */}
        {history.slice().reverse().map((session, index) => (
          <div key={session.date}>
            <div className={styles.sessionRow} onClick={() => handleToggleSession(session.date)}>
              <span className={styles.sessionTopic}>{session.topic}</span>
              <strong className={styles.sessionScore}>{session.finalScore}</strong>
              <span className={styles.sessionDate}>{new Date(session.date).toLocaleString()}</span>
            </div>

            {/* Conditionally render the expanded details view for the selected session */}
            {expandedSessionId === session.date && (
              <div className={styles.sessionDetails}>
                <div className={styles.detailsGrid}>
                  <div className={styles.feedbackBlock}>
                    <h4>✨ Overall AI Feedback</h4>
                    <p>"{session.overallFeedback}"</p>
                  </div>
                  <div className={styles.chartBlock}>
                    <h4>Performance Breakdown</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={session.resultsArray} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="question" tickFormatter={(tick, i) => `Q${i + 1}`} />
                        <YAxis label={{ value: 'Time (s)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="timeTaken" radius={[4, 4, 0, 0]}>
                          {session.resultsArray.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.verdict === 'Correct' ? 'var(--correct-color)' : 'var(--incorrect-color)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;