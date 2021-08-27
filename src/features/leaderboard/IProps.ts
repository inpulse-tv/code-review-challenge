import { ILeaderboard } from "../../datas/ILeaderboard";

export interface IProps {
  className?: string;
  datas: ILeaderboard[];
  excludeKeys?: string[];
  orderBy?: { key: string; isReverse: boolean }[];
}
