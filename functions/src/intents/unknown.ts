import {Intent} from "./intent";

export class UnknownIntent extends Intent {

    async makeResponse(parameters): Promise<string> {
        return "Sorry, I don't know what you are talking about";
    }
}