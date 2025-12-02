

import React, { useState } from 'react';
import { generateFeedbackFromGemini } from '../services/geminiService.js';

const FeedbackGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFeedback = async () => {
    if (!prompt) {
      alert("Please enter a topic for feedback.");
      return;
    }
    
    setIsLoading(true); 
    setFeedback(''); 
    const result = await generateFeedbackFromGemini(prompt);
    
    setFeedback(result); 
    setIsLoading(false); 
  };

  return (
    <div className="card">
      <h2>Gemini Feedback Generator</h2>
      <p>Enter a topic, and Gemini will provide feedback.</p>
      
      <textarea 
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., The plot of my new short story..."
      />
      
      <button 
        onClick={handleGenerateFeedback} 
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Get Feedback'}
      </button>
      {feedback && (
        <div className="feedback-result">
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackGenerator;
