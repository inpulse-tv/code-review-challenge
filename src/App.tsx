import React from 'react';
import { Countdown } from './features/countdown/Countdown';

import './App.css';

function App() {
  // Check countdown end duration for redirection.
  const handleTimeChange = (time: number) => {
    if (time < 0){
      console.log("Redirect !");
    }
  }

  return (
    <div className="App">
      <Countdown className="countdown" onTimeChange={handleTimeChange} />
    </div>
  );
}

export default App;
