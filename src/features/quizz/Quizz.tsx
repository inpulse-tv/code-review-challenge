import React, { MouseEvent } from "react";
import "./Quizz.scss";
import codes from "../../datas/codes.json";
import { IProps } from "./IProps";
import { IState } from "./IState";

/**
 * Quizz component.
 * Return the 10 first codes randomly get from the json codes datasource.
 * Access to the next code after a click on the component.
 * If the click is on the validate zone, a point is attribute.
 */
export class Quizz extends React.Component<IProps, IState> {
  preElm: React.RefObject<HTMLPreElement> | undefined;

  constructor(props: IProps) {
    super(props);
    this.state = {
      unOrderedList: [],
      getFromJson: null,
      index: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.preElm = React.createRef();
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
   * @returns an unordered list of codes
   */
  getUnOrderedCodes(): string[] {
    let list: string[] = codes.map((code) => code.code);

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
   * Apply result and select next code
   * @param e MouseEvent click
   */
  handleClick(e: MouseEvent): void {
    e.preventDefault();

    this.setState(
      (state) => {
        return {
          index: state.index + 1,
          getFromJson: this.state.unOrderedList[this.state.index + 1],
        };
      },
      () => {
        this.handleIndexChange();
        this.applyPrettify();
      }
    );
  }

  // Return the quizz current index.
  handleIndexChange(): void {
    this.props.onIndexChange(this.state.index);
  }

  componentDidMount(): void {
    // Get Quizz
    this.setState(() => {
      const unOrderedList: Array<string> = this.getUnOrderedCodes();
      return {
        unOrderedList: unOrderedList,
        getFromJson: unOrderedList[this.state.index],
      };
    }, this.applyPrettify);
  }

  render() {
    return (
      <pre ref={this.preElm} className="prettyprint">
        <code
          dangerouslySetInnerHTML={{
            __html: this.state.getFromJson ?? "",
          }}
          onClick={this.handleClick}></code>
      </pre>
    );
  }
}
