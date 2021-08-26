import { ITimeDiff } from "../../utils/timeDiff";

export interface IProps {
  className?: string;
  maxIndex: number;
  startIndex?: number;
  changeIndex?: boolean;
  onIndexChange: (values: [number, boolean, ITimeDiff]) => {} | void;
}
