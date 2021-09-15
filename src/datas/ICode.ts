export interface ICode {
    statement?: string,
    code: string,
    language: string,
    range: {
        start: number,
        length: number
    }
}