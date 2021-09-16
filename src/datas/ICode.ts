export interface ICode {
    id: number,
    statement?: string,
    code: string,
    language: string,
    range: {
        start: number,
        length: number
    }
}