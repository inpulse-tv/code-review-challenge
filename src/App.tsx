import React, { useState, useRef } from "react";
import { StartCountdown } from "./features/countdown/StartCountdown";
import { Quizz } from "./features/quizz/Quizz";
import Countdown, { zeroPad, CountdownRenderProps } from "react-countdown";

import "./App.scss";
import { ITimeDiff } from "./utils/timeDiff";

function App() {
  const [runQuizz, setRun] = useState(true);
  const [showQuizz, setShowQuizz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState({} as ITimeDiff);

  const countdownRef = useRef({} as Countdown);

  const maxIndex: number = 3;

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
  const handleIndexChange = (values: [number, boolean, ITimeDiff]) => {
    const [index, isCorrect, finalDate] = values;

    // Update user score.
    if (isCorrect) setPoints(points + 1);
    setTime(finalDate);

    // Reset index change.
    setChangeIndex(false);

    // Restart countdown.
    countdownRef.current.api?.isStopped() ||
    countdownRef.current.api?.isCompleted()
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
          endText="START !"
        />
      ) : null}
      {showQuizz ? (
        <div>
          <Countdown
            date={Date.now() + 59000}
            renderer={countdownRenderer}
            onComplete={handleCountdownComplete}
            onStop={handleCountdownStop}
            ref={countdownRef}
          />
          <Quizz
            onIndexChange={handleIndexChange}
            maxIndex={maxIndex}
            startIndex={0}
            changeIndex={changeIndex}
          />
        </div>
      ) : null}
      {showResult ? (
        <div className="results">
          <h1>Votre résultat</h1>
          <p>
            <b>{points}</b> bonne{points === 1 ? null : "s"} réponse
            {points === 1 ? null : "s"} sur <b>{maxIndex}</b>
          </p>
          <p>
            Temps réaslisé :{" "}
            <i>
              {zeroPad(time.minutes)}:{zeroPad(time.seconds)}.{zeroPad(time.milliseconds, 3)}
            </i>
          </p>
          {points === maxIndex && (
            <p>
              <b>Félicitation !</b>
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default App;
