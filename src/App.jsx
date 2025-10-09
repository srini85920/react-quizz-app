import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';

// Import all pages and layouts
import MainLayout from './pages/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import QuizListPage from './screens/QuizListPage.jsx';
import ResultsPage from './screens/ResultsPage.jsx';
import FeedbackGenerator from './components/FeedbackGenerator'; 

// --- 1. IMPORT THE SINGLE, REUSABLE QUIZ PAGE ---
// This path is correct based on your file structure screenshots.
import QuizPage from './pages/quizzes/QuizPage.jsx';

// --- 2. You no longer need to import the old, separate files ---
// import SportsQuizPage from './pages/quizzes/SportsQuizPage.jsx';
// import HistoryQuizPage from './pages/quizzes/HistoryQuizPage.jsx';
// import ComputersQuizPage from './pages/quizzes/ComputersQuizPage.jsx';
// import ArtQuizPage from './pages/quizzes/ArtQuizPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes that use the main layout with the Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/feedback" element={<FeedbackGenerator />} />
          </Route>

          {/* --- 3. DEDICATED ROUTES FOR EACH QUIZ TOPIC --- */}
          {/* Each route has a unique path, but they all use the same smart QuizPage component. */}
          {/* This gives you the separate "tabs" or pages you want. */}
          
          <Route 
            path="/quiz/sports" 
            element={<QuizPage topicName="Sports" />} 
          />
          <Route 
            path="/quiz/history" 
            element={<QuizPage topicName="History" />} 
          />
          <Route 
            path="/quiz/computers" 
            element={<QuizPage topicName="Computer Science" />} 
          />
          <Route 
            path="/quiz/art" 
            element={<QuizPage topicName="Art History" />} 
          />
          
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;