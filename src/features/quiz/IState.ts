import { ICode } from "../../datas/ICode";

export interface IState {
  unOrderedList: Array<ICode>;
  code: string | null;
  langCode: string | null;
  index: number;
  isCorrect: boolean;
  startDate: Date;
}
