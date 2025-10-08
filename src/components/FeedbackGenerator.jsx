// src/components/FeedbackGenerator.jsx

import React, { useState } from 'react';
// 1. Import the function you created
import { generateFeedbackFromGemini } from '../services/geminiService.js';

const FeedbackGenerator = () => {
  // 2. Set up state to manage the user's input, the API's response, and the loading status
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Create a handler function to be called when the button is clicked
  const handleGenerateFeedback = async () => {
    if (!prompt) {
      alert("Please enter a topic for feedback.");
      return;
    }
    
    setIsLoading(true); // Show loading message
    setFeedback(''); // Clear previous feedback
    
    // 4. THIS IS WHERE YOU CALL YOUR FUNCTION
    const result = await generateFeedbackFromGemini(prompt);
    
    setFeedback(result); // Update state with the result from the API
    setIsLoading(false); // Hide loading message
  };

  // 5. Render the UI (input, button, and a place to show the result)
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

      {/* Conditionally display the feedback */}
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