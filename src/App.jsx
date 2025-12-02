import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
//including all th pages
import MainLayout from './pages/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import QuizListPage from './screens/QuizListPage.jsx';
import ResultsPage from './screens/ResultsPage.jsx';
import FeedbackGenerator from './components/FeedbackGenerator'; 
import QuizPage from './pages/quizzes/QuizPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/feedback" element={<FeedbackGenerator />} />
          </Route>
          
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
