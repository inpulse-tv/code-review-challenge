import React, { useState, useRef } from "react";
import { StartCountdown } from "./features/countdown/StartCountdown";
import { Quiz } from "./features/quiz/Quiz";
import Countdown, { zeroPad, CountdownRenderProps } from "react-countdown";

import "./App.scss";
import { ITimeDiff } from "./utils/timeDiff";
import { Leaderboard } from "./features/leaderboard/leaderboard";
import quizDatas from "./datas/codes.json";
import RegisterFormular from "./features/forms/Register";
import { IValues as RegistrationValues } from "./features/forms/IValues";
import { ILeaderboard } from "./datas/ILeaderboard";
import LeaderboardService from "./features/leaderboard/leaderboard.service";
import useStateCallback from "./hooks/StateCallback";

function App() {
  const lbService = new LeaderboardService();

  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState({} as ITimeDiff);
  const [leaderboardData, setLeaderboardData] = useState(lbService.load());
  const [userData, setUserData] = useStateCallback(lbService.userInit);

  const countdownRef = useRef({} as Countdown);

  const maxIndex: number = 10;

  /**
   * Save user data in leaderboard.
   * @param user User data.
   */
  const saveLeaderboard = (user: ILeaderboard) => {
    setLeaderboardData(lbService.save(user));
  };

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
    setUserData(Object.assign({}, userData, values));
    setShowStartCountdown(true);
  };

  /**
   * handle escape key press event from registration formular.
   */
  const handleEscapeKeyPress = () => {
    setShowLeaderboard(true);
    setShowRegistration(false);
  };

  /**
   * Check Start Countdown end duration for redirection.
   * @param time Remaining time.
   */
  const handleCountdownTimeChange = (time: number) => {
    if (time < 0) {
      setShowStartCountdown(false);
      setShowQuiz(true);
    }
  };

  /**
   * Check quiz current index for score saving to leaderboard
   * and redirection to score result.
   * @param index Current index.
   */
  const handleIndexChange = (values: [number, boolean, ITimeDiff]) => {
    const [index, isCorrect, finalDate] = values;
    const currentScore: number = isCorrect ? points + 1 : points;

    // Update user score.
    if (isCorrect) setPoints(currentScore);
    setTime(finalDate);

    // Reset index change.
    setChangeIndex(false);

    // Restart countdown.
    countdownRef.current.api?.isStopped() ||
    countdownRef.current.api?.isCompleted()
      ? countdownRef.current.api?.start()
      : countdownRef.current.api?.stop();

    // Last index.
    if (index >= maxIndex) {
      // Add user score to leaderboard.
      setUserData(
        Object.assign({}, userData, {
          score: currentScore,
          millisecs: finalDate.total,
          time: `${zeroPad(finalDate.minutes)}:${zeroPad(
            finalDate.seconds
          )}.${zeroPad(finalDate.milliseconds, 3)}`,
        }),
        (s: ILeaderboard) => saveLeaderboard(s)
      );

      // Show result.
      setShowQuiz(false);
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
    // Set new Quiz index.
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
    // Reset score and data.
    setPoints(0);
    setUserData(lbService.userInit);
    setShowLeaderboard(true);
  };

  return (
    <div className="App">
      {showLeaderboard && (
        <div onClick={handleLeaderboardClick} className="leaderboard">
          <Title />
          <Leaderboard
            className="leaderboard-table"
            datas={leaderboardData}
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
        <RegisterFormular
          onSubmit={handleRegistrationSubmit}
          onEscapePress={handleEscapeKeyPress}
        />
      )}
      {showStartCountdown && (
        <StartCountdown
          className="start-countdown"
          onTimeChange={handleCountdownTimeChange}
          endText="START !"
        />
      )}
      {showQuiz && (
        <div>
          <Countdown
            date={Date.now() + 59000}
            renderer={countdownRenderer}
            onComplete={handleCountdownComplete}
            onStop={handleCountdownStop}
            ref={countdownRef}
          />
          <Quiz
            datas={quizDatas}
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
