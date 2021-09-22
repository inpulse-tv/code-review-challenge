import { ICode } from "../../datas/ICode";
import { ITimeDiff } from "../../utils/timeDiff";

export interface IProps {
  data: Array<ICode>;
  className?: string;
  maxIndex: number;
  startIndex?: number;
  changeIndex?: boolean;
  onIndexChange: (values: [number, boolean, string, ITimeDiff]) => {} | void;
}
