import React, { useState, useRef, useCallback, useEffect } from "react";
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
import { ILeaderboard } from "./datas/ILeaderboard";

function App() {
  // Default user data object.
  const userDataInit: ILeaderboard = {
    pseudo: "",
    email: null,
    score: 0,
    millisecs: 0,
    time: "",
  };

  /**
   * Save user data in leaderboard and localStorage.
   * @param user User data object.
   */
  const saveLeaderboard = (user: ILeaderboard) => {
    // Check if user exist.
    const index = leaderboardData.findIndex(
      (item) =>
        item.pseudo?.toString().toUpperCase() ===
        user.pseudo?.toString().toUpperCase()
    );
    if (index > -1) {
      const currentData = leaderboardData[index];

      // Check result.
      if (currentData.score > user.score) return;
      if (
        currentData.score === user.score &&
        currentData.millisecs > user.millisecs
      )
        return;

      // Update user.
      leaderboardData[index] = {
        pseudo: user.pseudo,
        email: user.email,
        millisecs: user.millisecs,
        score: user.score,
        time: user.time,
      };

      setLeaderboardData(leaderboardData);
      localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
    } else {
      // Add user.
      const newLeaderboard: ILeaderboard[] = [...leaderboardData, user];
      setLeaderboardData(newLeaderboard);
      localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
    }
  };

  /**
   * Get a Leaderboard object from local storage or json import if empty.
   * @returns The leaderboard data.
   */
  const getLeaderboard = (): ILeaderboard[] => {
    try {
      const s = localStorage.getItem("leaderboard");
      if (s === null) return lbDatas;
      return JSON.parse(s);
    } catch (e) {
      return lbDatas;
    }
  };

  /**
   * Allow using callback on React useState hook.
   * @param initialState current state.
   * @returns the current state with callback to execute.
   */
  const useStateCallback = (initialState: any) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef<any>(null);

    const setStateCallback = useCallback((state, cb) => {
      cbRef.current = cb;
      setState(state);
    }, []);

    useEffect(() => {
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null;
      }
    }, [state]);

    return [state, setStateCallback];
  };

  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(false);
  const [showQuizz, setShowQuizz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState({} as ITimeDiff);
  const [leaderboardData, setLeaderboardData] = useState(getLeaderboard());
  const [userData, setUserData] = useStateCallback(userDataInit);

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
    setUserData(Object.assign({}, userData, values));
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
    // Reset score and data.
    setPoints(0);
    setUserData(userDataInit);
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
