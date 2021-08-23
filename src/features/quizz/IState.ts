import { ICode } from "../../datas/ICode";

export interface IState {
    unOrderedList: Array<ICode>,
    getCode: string | null,
    getLangCode: string | null,
    index: number
}