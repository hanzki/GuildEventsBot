import { Response } from "../responses/response";

export abstract class Intent {
    abstract async makeResponse(parameters: any): Promise<Response>
}