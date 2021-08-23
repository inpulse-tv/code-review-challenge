import React, { MouseEvent } from "react";
import styles from "./Quizz.module.scss";
import codes from "../../datas/codes.json";
import { IProps } from "./IProps";
import { IState } from "./IState";
import { ICode } from "../../datas/ICode";
import { threadId } from "worker_threads";

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
      getCode: null,
      getLangCode: null,
      index: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.preElm = React.createRef();
  }

  /**
   * Display a circle on the screen when click.
   * @param e Mouse event.
   * @param isGoodAnswer Indicate if answer is correct.
   * @param callback Callback function. Execute after ripple animation.
   */
  addRippleClick(
    e: MouseEvent,
    isGoodAnswer: boolean,
    callback?: () => {} | void
  ): void {
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
      isGoodAnswer ? styles["ripple-good"] : styles["ripple-bad"]
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
   * @param e MouseEvent click.
   */
  validate(e: MouseEvent): boolean {
    /*
    const x = e.clientX, y = e.clientY;
    alert(document.elementFromPoint(x, y)?.innerHTML);
    */
    console.log(e.currentTarget);
    return true;
  }

  /**
   * Apply result and select next code.
   * @param e MouseEvent click.
   */
  handleClick(e: MouseEvent): void {
    e.preventDefault();

    // Prevent multiple clicks.
    if (this.isClicked) return;
    this.isClicked = true;

    const callback = () => {
      this.setState(
        (state) => {
          return {
            index: state.index + 1,
            getCode:
              this.state.index + 1 < this.props.maxIndex
                ? this.state.unOrderedList[this.state.index + 1].code
                : "",
            getLangCode:
              this.state.index + 1 < this.props.maxIndex
                ? this.state.unOrderedList[this.state.index + 1].language
                : "",
          };
        },
        () => {
          this.handleIndexChange();
          this.applyPrettify();
          this.isClicked = false;
        }
      );
    };

    const isGoodAnswer: boolean = this.validate(e);
    this.addRippleClick(e, isGoodAnswer, callback);
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
    this.setState(() => {
      return {
        unOrderedList: unOrderedList,
        getCode: unOrderedList[this.state.index].code,
        getLangCode: unOrderedList[this.state.index].language,
      };
    }, this.applyPrettify);
  }

  render() {
    return (
      <pre ref={this.preElm} className={`prettyprint ${this.state.getLangCode}`}>
        <code onClick={this.handleClick}>{this.state.getCode}</code>
      </pre>
    );
  }
}
