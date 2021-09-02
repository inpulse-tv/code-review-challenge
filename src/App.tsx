import React, { useState, useRef } from "react";
import { StartCountdown } from "./features/countdown/StartCountdown";
import { Quizz } from "./features/quizz/Quizz";
import Countdown, { zeroPad, CountdownRenderProps } from "react-countdown";

import "./App.scss";
import { ITimeDiff } from "./utils/timeDiff";
import { Leaderboard } from "./features/leaderboard/leaderboard";
import quizzDatas from "./datas/codes.json";
import lbDatas from "./datas/leaderboard.json";
import RegisterFormular from "./features/forms/Register";
import { IValues as RegistrationValues } from "./features/forms/IValues";

function App() {
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(false);
  const [showQuizz, setShowQuizz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState({} as ITimeDiff);

  const countdownRef = useRef({} as Countdown);

  const maxIndex: number = 3;

  /**
   * Handle click event on leaderboard.
   */
  const handleLeaderboardClick = () => {
    setShowLeaderboard(false);
    setShowRegistration(true);
  };

  /**
   * Handle registration submit event.
   */
  const handleRegistrationSubmit = (values: RegistrationValues) => {
    setShowRegistration(false);
    console.log(JSON.stringify(values, null, 2));
    setShowStartCountdown(true);
  };

  /**
   * Check Start Countdown end duration for redirection.
   * @param time Remaining time.
   */
  const handleCountdownTimeChange = (time: number) => {
    if (time < 0) {
      setShowStartCountdown(false);
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

    if (index >= maxIndex) {
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

  /**
   * Handle click on user result display.
   */
  const handleEndClick = (): void => {
    setShowResult(false);
    // Reset score.
    setPoints(0);
    setShowLeaderboard(true);
  };

  return (
    <div className="App">
      {showLeaderboard && (
        <div onClick={handleLeaderboardClick} className="leaderboard">
          <Title />
          <Leaderboard
            className="leaderboard-table"
            datas={lbDatas}
            excludeKeys={["email", "millisecs"]}
            maxDisplayRow={5}
            orderBy={[
              { key: "score", isReverse: true },
              { key: "time", isReverse: false },
            ]}
          />
          <p className="start-text">Appuyez sur l'ecran pour demarrer le jeu</p>
        </div>
      )}
      {showRegistration && (
        <RegisterFormular onSubmit={handleRegistrationSubmit} />
      )}
      {showStartCountdown && (
        <StartCountdown
          className="start-countdown"
          onTimeChange={handleCountdownTimeChange}
          endText="START !"
        />
      )}
      {showQuizz && (
        <div>
          <Countdown
            date={Date.now() + 59000}
            renderer={countdownRenderer}
            onComplete={handleCountdownComplete}
            onStop={handleCountdownStop}
            ref={countdownRef}
          />
          <Quizz
            datas={quizzDatas}
            onIndexChange={handleIndexChange}
            maxIndex={maxIndex}
            startIndex={0}
            changeIndex={changeIndex}
          />
        </div>
      )}
      {showResult && (
        <div className="results" onClick={handleEndClick}>
          <h1>Votre score</h1>
          <p>
            <b>{points}</b> bonne{points === 1 ? null : "s"} reponse
            {points === 1 ? null : "s"} sur <b>{maxIndex}</b>
          </p>
          <p>
            Temps realise :{" "}
            <i>
              {zeroPad(time.minutes)}:{zeroPad(time.seconds)}.
              {zeroPad(time.milliseconds, 3)}
            </i>
          </p>
          {points === maxIndex && (
            <p>
              <b>Felicitation !</b>
            </p>
          )}
          {points === maxIndex && (
            <div className="pyro">
              <div className="before"></div>
              <div className="after"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Title = (): JSX.Element => {
  return <h1>inpulse Code Review Challenge</h1>;
};

export default App;
