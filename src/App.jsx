import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css'; // Or index.css
import FeedbackGenerator from './components/FeedbackGenerator'; 

// Import all pages and layouts
import MainLayout from './pages/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import QuizListPage from './screens/QuizListPage.jsx';
import ResultsPage from './screens/ResultsPage.jsx';

// Import all your separate quiz pages
import SportsQuizPage from './pages/quizzes/SportsQuizPage.jsx';
import HistoryQuizPage from './pages/quizzes/HistoryQuizPage.jsx';
import ComputersQuizPage from './pages/quizzes/ComputersQuizPage.jsx';
import ArtQuizPage from './pages/quizzes/ArtQuizPage.jsx';

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

          

          {/* ADD A DEDICATED ROUTE FOR EACH QUIZ */}
          <Route path="/quiz/sports" element={<SportsQuizPage />} />
          <Route path="/quiz/history" element={<HistoryQuizPage />} />
          <Route path="/quiz/computers" element={<ComputersQuizPage />} />
          <Route path="/quiz/art" element={<ArtQuizPage />} />
          
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;