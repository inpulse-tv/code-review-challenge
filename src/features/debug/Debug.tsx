import react, { useRef } from "react";
import Display from "../Display";
import { IProps } from "./IProps";

/**
 * Display a debugging tool bar.
 * - Show number of Quiz.
 * - Display a specific Quiz.
 * - Control answer position.
 * @returns the debug component.
 */
const Debug = (props: IProps) => {
  const inputIdRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  /**
   * Redirect to the specified quiz ID.
   * @param ev
   */
  const handleIDSubmit = (
    ev: react.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (props.display === Display.Quiz && inputIdRef.current) {
      const id = parseInt(inputIdRef.current.value);
      if (checkboxRef.current) checkboxRef.current.checked = false;
      props.quizRef.current.displayQuiz(id);
    }
  };

  /**
   * Display answer position on quiz element.
   * @param ev The event click.
   */
  const handleShowAnswerChange = (
    ev: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (props.display === Display.Quiz)
      props.quizRef.current.showAnswer(ev.currentTarget.checked);
  };

  return (
    <div className="debug">
      <dl>
        <dt>Number of quiz</dt>
        <dd>{props.quizData.length}</dd>
      </dl>
      <dl>
        <dt>Select quiz Id</dt>
        <dd>
          <input type="text" ref={inputIdRef}></input>
        </dd>
        <dd>
          <button onClick={(ev) => handleIDSubmit(ev)}>GO</button>
        </dd>
      </dl>
      <dl>
        <dt>Show answer</dt>
        <dd>
          <input
            type="checkbox" ref={checkboxRef}
            onChange={(ev) => handleShowAnswerChange(ev)}></input>
        </dd>
      </dl>
    </div>
  );
};

export default Debug;
