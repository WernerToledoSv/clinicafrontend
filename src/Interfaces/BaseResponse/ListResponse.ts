export class ListResponse<T> {
    code: number;
    message: string;
    items: T[];

    constructor(code: number, message: string, items: T[]) {
        this.code = code;
        this.message = message;
        this.items = items;
    }
}
