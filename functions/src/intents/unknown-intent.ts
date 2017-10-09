import {Intent} from "./intent";
import {Response} from "../responses/response";
import {SimpleResponse} from "../responses/simple-response";

export class UnknownIntent extends Intent {

    async makeResponse(parameters): Promise<Response> {
        return new SimpleResponse("Sorry, I don't know what you are talking about");
    }
}