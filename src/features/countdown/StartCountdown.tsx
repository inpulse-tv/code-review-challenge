import React from "react";
import styles from "./StartCountdown.module.scss";
import { IProps } from "./IProps";

/**
 * Generate a countdown element.
 * Numbers can be defined in scss associate file.
 *
 * @returns the countdown
 */
export class StartCountdown extends React.Component<IProps, {time: number}> {
  maxNum = parseInt(styles.maxNumber);
  numbers: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>[] = [];
  timerID: number | undefined;

  constructor(props:IProps) {
    super(props);
    this.state = {
      time: parseInt(styles.animDuration)
    }
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  /**
   * Return the remaining duration of the countdown.
   * @param time the remaining time.
   */
  handleTimeChange(time: number) {
    this.props.onTimeChange(time);
    if (time < 0) {
      window.clearInterval(this.timerID);
    }
  }

  componentDidMount() {
    // Generate countdown values.
    for (let i = this.maxNum; i > 0; i--) {
      let numberClassName = "num" + i;
      this.numbers.push(
        <span key={"num" + i} className={styles[numberClassName]}>{i}</span>
      );
    }
    this.numbers.push(<span key="num0" className={styles.num0}>START !</span>);

    // Define animation remaining duration.
    this.timerID = window.setInterval(() => this.setState(state => { this.handleTimeChange(state.time); return { time: state.time - 1 }}), 1000);
  }

  render() {
    return <div className={`${this.props.className} ${styles.number}`}>{this.numbers}</div>;
  }
}
