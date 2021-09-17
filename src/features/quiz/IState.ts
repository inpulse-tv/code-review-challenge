import { ICode } from "../../datas/ICode";

export interface IState {
  unOrderedList: Array<ICode>;
  statement?: string;
  code?: string;
  langCode?: string;
  noCode: boolean;
  index: number;
  isCorrect: boolean;
  startDate: Date;
}
