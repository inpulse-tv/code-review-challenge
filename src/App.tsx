import React, { useState } from 'react';
import { Countdown } from './features/countdown/Countdown';
import { Quizz } from './features/quizz/Quizz';

import './App.css';

function App() {
  const [runQuizz, setRun] = useState(false);
  const [showQuizz, setShowQuizz] = useState(true);
  const [showResult, setShowResult] = useState(false);

  /**
   * Check countdown end duration for redirection.
   * @param time Remaining time.
   */
  const handleTimeChange = (time: number) => {
    if (time < 0){
      setRun(false);
      setShowQuizz(true);
    }
  }

  /**
   * Check quizz current index for redirection.
   * @param index Current index.
   */
  const handleChangeIndex = (index: number) => {
    if (index >= 3) {
      setShowQuizz(false);
      setShowResult(true);
    }
  }

  return (
    <div className="App">
      {runQuizz ? <Countdown className="countdown" onTimeChange={handleTimeChange} /> : null }
      {showQuizz ? <Quizz onIndexChange={handleChangeIndex} maxIndex={3} /> : null }
      {showResult ? <p>Game Over</p> : null }
    </div>
  );
}

export default App;
