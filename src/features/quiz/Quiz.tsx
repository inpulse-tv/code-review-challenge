import React, { MouseEvent as ReactMouseEvent } from "react";
import styles from "./Quiz.module.scss";
import { IProps } from "./IProps";
import { IState } from "./IState";
import { ICode } from "../../datas/ICode";
import { getTimeDiff, ITimeDiff } from "../../utils/timeDiff";
import { getLanguage } from "../Language";

/**
 * Quiz component.
 * Return the n first codes randomly get from the json codes datasource.
 * Access to the next code after a click on the component.
 * If the click is on the validate zone, a point is attribute.
 */
export class Quiz extends React.Component<IProps, IState> {
  preElm: React.RefObject<HTMLPreElement> | undefined;
  isClicked: boolean = false;
  rippleDuration: number = parseInt(styles.rippleDuration);

  constructor(props: IProps) {
    super(props);
    this.state = {
      unOrderedList: [],
      statement: undefined,
      code: undefined,
      langCode: undefined,
      noCode: false,
      index: props.startIndex ?? 0,
      isCorrect: false,
      startDate: new Date(),
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.handleValidateClick = this.handleValidateClick.bind(this);
    this.getQuiz = this.getQuiz.bind(this);
    this.preElm = React.createRef();
  }

  /**
   * Display a circle on the screen when click.
   * @param e Mouse event.
   * @param callback Callback function. Execute after ripple animation.
   */
  addRippleClick(e: ReactMouseEvent, callback?: () => {} | void): void {
    const circle = document.createElement("span");
    const diameter = Math.max(400, 400);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - radius}px`;
    circle.style.top = `${e.clientY - radius}px`;
    let classNames: string[] = [];
    classNames.push(styles.ripple);
    classNames.push(
      this.state.isCorrect ? styles["ripple-good"] : styles["ripple-bad"]
    );
    circle.classList.add(...classNames);

    const ripple = document.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    e.currentTarget.appendChild(circle);

    if (callback) {
      setTimeout(callback, this.rippleDuration);
    }
  }

  /**
   * Apply Google Code Prettify to code rendering.
   * @param isApply Allow removing only.
   */
  applyPrettify(isApply: boolean = true): void {
    // Remove prettyprinted class placed by Prettify on pre HTML element.
    this.preElm?.current?.classList.remove("prettyprinted");

    if (isApply) {
      // Use window global variable to get PrettyPrint function.
      const PR = (window as { [key: string]: any })["PR"] as any;
      PR.prettyPrint();
    }
  }

  /**
   * Get and randomly order the datasource.
   * @returns an unordered list of codes.
   */
  getUnOrderedCodes(): ICode[] {
    let list: ICode[] = this.props.datas.map((code) => code);

    // Unorder codes list
    for (var i = 0; i < list.length - 1; i++) {
      var j = i + Math.floor(Math.random() * (list.length - i));
      var temp = list[j];
      list[j] = list[i];
      list[i] = temp;
    }

    return list;
  }

  /**
   * Select next quiz on the list.
   * @param isCurrentIndex don't change current index.
   */
  getQuiz(isCurrentIndex: boolean = false): void {
    this.setState(
      (state, props) => {
        const newIndex: number = isCurrentIndex ? state.index : state.index + 1;
        return {
          index: newIndex,
          statement:
            newIndex < props.maxIndex
              ? state.unOrderedList[newIndex].statement ?? undefined
              : "",
          code:
            newIndex < props.maxIndex ? state.unOrderedList[newIndex].code : "",
          langCode:
            newIndex < props.maxIndex
              ? state.unOrderedList[newIndex].language
              : "",
          noCode:
            newIndex < props.maxIndex
              ? state.unOrderedList[newIndex].nocode ?? false
              : false,
        };
      },
      () => {
        this.handleIndexChange();
        if (this.state.index < this.props.maxIndex) {
          this.applyAnswer();
          this.applyPrettify(!this.state.noCode);
        }
        this.isClicked = false;
      }
    );
  }

  /**
   * Apply click event to wrong code element.
   */
  applyAnswer(): void {
    if (this.preElm?.current) {
      // Reinit answer status.
      this.setState(() => {
        return { isCorrect: false };
      });

      const currentElm: HTMLElement =
        this.preElm.current.getElementsByTagName("code")[0];
      let html: string = currentElm.innerHTML;
      const startIndex: number =
        this.state.unOrderedList[this.state.index].range.start;
      const indexLength: number =
        this.state.unOrderedList[this.state.index].range.length;

      // Add event click to wrong code.
      const wrongText: string = html.substring(
        startIndex,
        startIndex + indexLength
      );
      html =
        html.substring(0, startIndex) +
        `<span class=${styles.answer}>${wrongText}</span>` +
        html.substring(startIndex + indexLength);
      currentElm.innerHTML = html;
      currentElm
        .getElementsByClassName(styles.answer)[0]
        .addEventListener("click", this.handleValidateClick);
    }
  }

  /**
   * Used to show answer position.
   * For debug only.
   * @param isChecked
   */
  showAnswer(isChecked: boolean): void {
    if (process.env.NODE_ENV !== "production") {
      if (this.preElm?.current) {
        const currentElm: HTMLElement =
          this.preElm.current.getElementsByTagName("code")[0];
        const answer = currentElm.getElementsByClassName(styles.answer)[0];
        answer.classList.toggle(styles.answer_show, isChecked);
      }
    }
  }

  /**
   * Display a specif quiz from his Id.
   * For debug only.
   * @param id The quiz Id.
   */
  displayQuiz(id: number): void {
    if (process.env.NODE_ENV !== "production") {
      const results: ICode[] = this.props.datas.filter(
        (code) => code.id === id
      );
      if (results.length > 0) {
        // Apply specific quiz to current index.
        const quiz: ICode = results[0];
        let unOrderedList = [...this.state.unOrderedList];
        unOrderedList[this.state.index] = quiz;
        this.setState({ unOrderedList }, () => {
          this.getQuiz(true);
        });
      }
    }
  }

  /**
   * Check answer and return result.
   */
  handleValidateClick(): void {
    this.setState(() => {
      return { isCorrect: true };
    });
  }

  /**
   * Apply result and select next code.
   * @param e MouseEvent click.
   */
  handleClick(e: ReactMouseEvent): void {
    e.preventDefault();
    // Prevent multiple clicks.
    if (this.isClicked) return;
    this.isClicked = true;
    // Add and render Ripple from answer.
    this.addRippleClick(e, this.getQuiz);
  }

  /**
   * Return the quiz current index.
   */
  handleIndexChange(): void {
    const finalDate: ITimeDiff = getTimeDiff(this.state.startDate, new Date());
    this.props.onIndexChange([
      this.state.index,
      this.state.isCorrect,
      getLanguage(this.state.unOrderedList[this.state.index].language),
      finalDate,
    ]);
  }

  /**
   * Init quiz list.
   */
  componentDidMount(): void {
    this.setState(
      {
        unOrderedList: this.getUnOrderedCodes(),
      },
      () => {
        // Get Quiz.
        this.getQuiz(true);
      }
    );
  }

  componentDidUpdate(prevProps: IProps): void {
    // Change Quiz if countdown duration set 0 and ask for new index.
    if (
      this.props.changeIndex !== undefined &&
      prevProps.changeIndex !== this.props.changeIndex &&
      this.props.changeIndex
    ) {
      this.getQuiz();
    }
  }

  render() {
    return (
      <pre
        ref={this.preElm}
        className={`prettyprint lang-${this.state.langCode}`}>
        {this.state.statement && (
          <div className={`${styles.statement} nocode`}>
            <span>{this.state.statement}</span>
            <br />
          </div>
        )}
        <code onClick={this.handleClick}>{this.state.code}</code>
      </pre>
    );
  }
}
