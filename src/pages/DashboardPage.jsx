import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
// --- THIS IS THE FIX ---
// You were missing LineChart, Line, and Legend from this import
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const DashboardPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    const chartData = storedHistory
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item, index) => {
        const [score, total] = item.finalScore.split('/').map(Number);
        return {
          name: `${item.topic} #${index + 1}`,
          accuracy: total > 0 ? parseFloat(((score / total) * 100).toFixed(1)) : 0,
          date: new Date(item.date).toLocaleDateString(), 
        };
      });
    setHistory(chartData);
  }, []);

  if (history.length === 0) {
    // ... your empty state JSX ...
    return (
        <div className={styles.dashboardContainer}>
          <h1 className={styles.title}>Your Dashboard</h1>
          <div className={styles.emptyState}>
            <h2>No quiz history found.</h2>
            <p>Complete a quiz to see your progress here!</p>
            <Link to="/quiz" className="button">Start a Quiz</Link>
          </div>
        </div>
      );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Your Progress</h1>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          {/* This part will now work because LineChart is imported */}
          <LineChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={"var(--border-color)"} />
            <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} stroke="var(--secondary-text)" />
            <YAxis domain={[0, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: 'var(--secondary-text)' }} stroke="var(--secondary-text)" />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              cursor={{ stroke: 'var(--border-color)' }}
            />
            <Legend wrapperStyle={{ color: 'var(--primary-text)' }} />
            <Line type="monotone" dataKey="accuracy" stroke="var(--primary-color)" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;