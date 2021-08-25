import React, { useState, useRef } from "react";
import { StartCountdown } from "./features/countdown/StartCountdown";
import { Quizz } from "./features/quizz/Quizz";
import Countdown, { zeroPad, CountdownRenderProps } from "react-countdown";

import "./App.css";

function App() {
  const [runQuizz, setRun] = useState(false);
  const [showQuizz, setShowQuizz] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);

  const countdownRef = useRef({} as Countdown);

  /**
   * Check Start Countdown end duration for redirection.
   * @param time Remaining time.
   */
  const handleCountdownTimeChange = (time: number) => {
    if (time < 0) {
      setRun(false);
      setShowQuizz(true);
    }
  };

  /**
   * Check quizz current index for redirection.
   * @param index Current index.
   */
  const handleIndexChange = (index: number) => {
    setChangeIndex(false);

    // Restart countdown.
    countdownRef.current.api?.isStopped() || countdownRef.current.api?.isCompleted()
      ? countdownRef.current.api?.start()
      : countdownRef.current.api?.stop();

    if (index >= 3) {
      setShowQuizz(false);
      setShowResult(true);
    }
  };

  /**
   * Specific rendering for react-countdown component.
   * @param param0 CountdownRenderProps.
   * @returns the Countdown renderer.
   */
  const countdownRenderer = ({ seconds }: CountdownRenderProps) => {
    // Render a countdown.
    return <span className="countdown-display">{zeroPad(seconds)}</span>;
  };

  /**
   * Handle the onComplete react-countdown event.
   */
  const handleCountdownComplete = (): void => {
    // Set new Quizz index.
    setChangeIndex(true);
  };

  /**
   * Handle the onStop react-countdown event.
   */
  const handleCountdownStop = (): void => {
    // Allowed countdown reinitialisation waiting after stop.
    countdownRef.current?.api?.start();
  };

  return (
    <div className="App">
      {runQuizz ? (
        <StartCountdown
          className="start-countdown"
          onTimeChange={handleCountdownTimeChange}
        />
      ) : null}
      {showQuizz ? (
        <div>
          <Countdown
            date={Date.now() + 3000}
            renderer={countdownRenderer}
            onComplete={handleCountdownComplete}
            onStop={handleCountdownStop}
            ref={countdownRef}
          />
          <Quizz
            onIndexChange={handleIndexChange}
            maxIndex={3}
            startIndex={0}
            changeIndex={changeIndex}
          />
        </div>
      ) : null}
      {showResult ? <p>Game Over</p> : null}
    </div>
  );
}

export default App;
