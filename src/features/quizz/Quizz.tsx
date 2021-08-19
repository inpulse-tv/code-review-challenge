import React from "react";
import "./Quizz.scss";
import codes from '../../datas/codes.json';
import { IProps } from "./IProps";

export class Quizz extends React.Component<IProps, { getFromJson: string | null}> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      getFromJson: null
    };
  }

  componentDidMount() {
    // Use window global variable to get PrettyPrint function.
    const PR = (window as { [key: string]: any })["PR"] as any;

    // Get Quizz
    this.setState(() => { return { getFromJson: codes.map((code) => code.code)[0] }});

    // Wait for the state to be update.
    setTimeout(() => { PR.prettyPrint(); }, 0);
  }

  render() {
    return (
      <pre className="prettyprint">
        <code
          dangerouslySetInnerHTML={{
            __html: this.state.getFromJson ?? "",
          }}></code>
      </pre>
    );
  }
}
