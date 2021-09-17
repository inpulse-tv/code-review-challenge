import React, { useState, useRef } from "react";
import { StartCountdown } from "./features/countdown/StartCountdown";
import { Quiz } from "./features/quiz/Quiz";
import Countdown, { zeroPad, CountdownRenderProps } from "react-countdown";

import "./App.scss";
import { ITimeDiff } from "./utils/timeDiff";
import { Leaderboard } from "./features/leaderboard/Leaderboard";
import quizData from "./datas/codes.json";
import RegisterFormular from "./features/forms/Register";
import { IValues as RegistrationValues } from "./features/forms/IValues";
import { ILeaderboard } from "./datas/ILeaderboard";
import LeaderboardService from "./features/leaderboard/Leaderboard.Service";
import useStateCallback from "./hooks/StateCallback";
import Display from "./features/Display";
import Debug from "./features/debug/Debug";

function App() {
  const lbService = new LeaderboardService();

  const [displayScreen, setDisplayScreen] = useState(1);
  const [changeIndex, setChangeIndex] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState({} as ITimeDiff);
  const [language, setLanguage] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState(lbService.load());
  const [userData, setUserData] = useStateCallback(lbService.userInit);
  const [showDebug] = useState(process.env.NODE_ENV !== "production");

  const countdownRef = useRef({} as Countdown);
  const quizRef = useRef({} as Quiz);

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
    setDisplayScreen(Display.Registration);
  };

  /**
   * Handle registration submit event.
   */
  const handleRegistrationSubmit = (values: RegistrationValues) => {
    setUserData(Object.assign({}, userData, values));
    setDisplayScreen(Display.Countdown);
  };

  /**
   * handle escape key press event from registration formular.
   */
  const handleEscapeKeyPress = () => {
    setDisplayScreen(Display.Leaderboard);
  };

  /**
   * Check Start Countdown end duration for redirection.
   * @param time Remaining time.
   */
  const handleCountdownTimeChange = (time: number) => {
    if (time < 0) {
      setDisplayScreen(Display.Quiz);
    }
  };

  /**
   * Check quiz current index for score saving to leaderboard
   * and redirection to score result.
   * @param index Current index.
   */
  const handleIndexChange = (values: [number, boolean, string, ITimeDiff]) => {
    const [index, isCorrect, language, finalDate] = values;
    const currentScore: number = isCorrect ? points + 1 : points;

    // Update user score.
    if (isCorrect) setPoints(currentScore);
    setTime(finalDate);

    // Set quiz language.
    setLanguage(language);

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
      setDisplayScreen(Display.Result);
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
    // Reset score and data.
    setPoints(0);
    setUserData(lbService.userInit);
    setDisplayScreen(Display.Leaderboard);
  };

  /**
   * Display a tile element.
   * @returns a tilte component.
   */
  const Title = (): JSX.Element => {
    return <h1>inpulse Code Review Challenge</h1>;
  };

  /**
   * Display a debug tool bar element.
   */
  let DebugToolBar: any;
  if (process.env.NODE_ENV !== "production") {
    DebugToolBar = Debug;
  } else {
    DebugToolBar = () => null;
  }

  return (
    <div className="App">
      {showDebug && (
        <DebugToolBar
          quizData={quizData}
          display={displayScreen}
          quizRef={quizRef}
        />
      )}
      {displayScreen === Display.Leaderboard && (
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
      {displayScreen === Display.Registration && (
        <RegisterFormular
          onSubmit={handleRegistrationSubmit}
          onEscapePress={handleEscapeKeyPress}
        />
      )}
      {displayScreen === Display.Countdown && (
        <StartCountdown
          className="start-countdown"
          onTimeChange={handleCountdownTimeChange}
          endText="START !"
        />
      )}
      {displayScreen === Display.Quiz && (
        <div>
          <div className="quiz-toolbar">
            {language && (`${language} / `)}
            <Countdown
              date={Date.now() + 59000}
              renderer={countdownRenderer}
              onComplete={handleCountdownComplete}
              onStop={handleCountdownStop}
              ref={countdownRef}
            />
          </div>
          <Quiz
            datas={quizData}
            onIndexChange={handleIndexChange}
            maxIndex={maxIndex}
            startIndex={0}
            changeIndex={changeIndex}
            ref={quizRef}
          />
        </div>
      )}
      {displayScreen === Display.Result && (
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

export default App;
