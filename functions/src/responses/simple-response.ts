import {Response} from "./response";

export class SimpleResponse extends Response {

    constructor(private message) {
        super();
    }

    toString(): string {
        return this.message;
    }
}