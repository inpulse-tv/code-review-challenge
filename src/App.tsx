import React from 'react';
import { Countdown } from './features/countdown/Countdown';
import { Quizz } from './features/quizz/Quizz';

import './App.css';


function App() {
  // Check countdown end duration for redirection.
  const handleTimeChange = (time: number) => {
    if (time < 0){
      console.log("Redirect !");
    }
  }


  //<Countdown className="countdown" onTimeChange={handleTimeChange} />
  return (
    <div className="App">
      <Quizz />
    </div>
  );
}

export default App;
