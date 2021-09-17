export interface ICode {
    id: number,
    statement?: string,
    code: string,
    language: string,
    nocode?: boolean,
    range: {
        start: number,
        length: number
    }
}