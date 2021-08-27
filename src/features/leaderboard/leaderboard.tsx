import React from "react";
import { ILeaderboard } from "../../datas/ILeaderboard";
import { IProps } from "./IProps";

export class Leaderboard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);
  }

  /**
   * Return the keys from data.
   * @returns an array of keys
   */
  getKeys = (): string[] => {
    return Object.keys(this.props.datas[0]).filter(
      (key) => !this.props.excludeKeys?.includes(key)
    );
  };

  /**
   * Generate table header from json keys.
   * @returns the table header row.
   */
  getHeader = (): JSX.Element[] => {
    const keys = this.getKeys();
    return keys.map((key) => {
      return <th key={key}>{key.toUpperCase()}</th>;
    });
  };

  /**
   * Sort table rows from multiple fields.
   * @param args
   * @returns
   */
  sortBy = <T extends ILeaderboard>(...args: { (a: T, b: T): number }[]) => {
    const callbacks = args;

    return (a: T, b: T): number => {
      for (let i = 0; i < callbacks.length; i++) {
        const value = callbacks[i](a, b);
        if (value !== 0) {
          return value;
        }
      }
      return 0;
    };
  };

  /**
   * Field value camparator for sorting.
   * @param a field value.
   * @param b field value.
   * @returns the comparator number.
   */
  compare = (
    a: number | string | null,
    b: number | string | null,
    reverse: boolean
  ): number => {
    const mult = reverse ? -1 : 1;
    if ((a ?? 0) < (b ?? 0)) return mult * -1;
    if ((a ?? 0) > (b ?? 0)) return mult * 1;
    return 0;
  };

  /**
   * Generate table rows from data file.
   * @returns an array of row elements.
   */
  getRowsData = (): JSX.Element[] => {
    let items = this.props.datas;
    if (this.props.orderBy) {
      let fieldOrders: { (a: ILeaderboard, b: ILeaderboard): number }[] = [];
      this.props.orderBy.forEach((order) => {
        fieldOrders.push((a, b) => this.compare(a[order.key], b[order.key], order.isReverse));
      });
      items = items.sort(this.sortBy(...fieldOrders));
    }
    const keys = this.getKeys();
    return items.map((row, index) => {
      return (
        <tr key={index}>
          <RenderRow key={index} data={row} keys={keys} />
        </tr>
      );
    });
  };

  render() {
    return (
      <div className={this.props.className}>
        <table>
          <thead>
            <tr>{this.getHeader()}</tr>
          </thead>
          <tbody>{this.getRowsData()}</tbody>
        </table>
      </div>
    );
  }
}

interface IRow {
  key: number;
  data: ILeaderboard;
  keys: string[];
}

const RenderRow = (props: IRow): JSX.Element => {
  return (
    <>
      {props.keys.map((key) => {
        return <td key={props.data[key]}>{props.data[key]}</td>;
      })}
    </>
  );
};
