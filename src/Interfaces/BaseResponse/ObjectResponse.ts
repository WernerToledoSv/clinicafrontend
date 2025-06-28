export class ObjectResponse<T> {
    code: number;
    message: string;
    item: T;

    constructor(code: number, message: string, item: T) {
        this.code = code;
        this.message = message;
        this.item = item;
    }
}
