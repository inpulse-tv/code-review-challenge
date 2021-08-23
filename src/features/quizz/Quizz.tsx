import React, { MouseEvent as ReactMouseEvent } from "react";
import styles from "./Quizz.module.scss";
import codes from "../../datas/codes.json";
import { IProps } from "./IProps";
import { IState } from "./IState";
import { ICode } from "../../datas/ICode";

/**
 * Quizz component.
 * Return the 10 first codes randomly get from the json codes datasource.
 * Access to the next code after a click on the component.
 * If the click is on the validate zone, a point is attribute.
 */
export class Quizz extends React.Component<IProps, IState> {
  preElm: React.RefObject<HTMLPreElement> | undefined;
  isClicked: boolean = false;

  constructor(props: IProps) {
    super(props);
    this.state = {
      unOrderedList: [],
      code: null,
      langCode: null,
      index: 0,
      isCorrect: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.validate = this.validate.bind(this);
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
    const margin = 80;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.screenX - radius}px`;
    circle.style.top = `${e.screenY - radius - margin}px`;
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
      setTimeout(callback, 600);
    }
  }

  /**
   * Apply Google Code Prettify to code rendering.
   */
  applyPrettify(): void {
    // Remove prettyprinted class placed by Prettify from pre HTML element.
    this.preElm?.current?.classList.remove("prettyprinted");

    // Use window global variable to get PrettyPrint function.
    const PR = (window as { [key: string]: any })["PR"] as any;
    PR.prettyPrint();
  }

  /**
   * Get and randomly order the datasource.
   * @returns an unordered list of codes.
   */
  getUnOrderedCodes(): ICode[] {
    let list: ICode[] = codes.map((code) => code);

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
   * Check answer and return result.
   */
  validate(): void {
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

    const callback = () => {
      this.setState(
        (state, props) => {
          return {
            index: state.index + 1,
            code:
              state.index + 1 < props.maxIndex
                ? state.unOrderedList[state.index + 1].code
                : "",
            langCode:
              state.index + 1 < props.maxIndex
                ? state.unOrderedList[state.index + 1].language
                : "",
          };
        },
        () => {
          this.handleIndexChange();
          if (this.state.index < this.props.maxIndex) {
            this.applyAnswer();
            this.applyPrettify();
          }
          this.isClicked = false;
        }
      );
    };

    this.addRippleClick(e, callback);
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
        `<span class="answer">${wrongText}</span>` +
        html.substring(startIndex + indexLength);
      currentElm.innerHTML = html;
      currentElm
        .getElementsByClassName("answer")[0]
        .addEventListener("click", this.validate);
    }
  }

  /**
   * Return the quizz current index.
   */
  handleIndexChange(): void {
    this.props.onIndexChange(this.state.index);
  }

  componentDidMount(): void {
    // Get Quizz.
    const unOrderedList: Array<ICode> = this.getUnOrderedCodes();
    this.setState(
      () => {
        return {
          unOrderedList: unOrderedList,
          code: unOrderedList[this.state.index].code,
          langCode: unOrderedList[this.state.index].language,
        };
      },
      () => {
        this.applyAnswer();
        this.applyPrettify();
      }
    );
  }

  render() {
    return (
      <pre ref={this.preElm} className={`prettyprint ${this.state.langCode}`}>
        <code onClick={this.handleClick}>{this.state.code}</code>
      </pre>
    );
  }
}
