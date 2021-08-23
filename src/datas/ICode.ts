export interface ICode {
    code: string,
    language: string,
    range: {
        start: number,
        end: number
    }
}