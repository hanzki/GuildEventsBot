
export abstract class Intent {
    abstract async makeResponse(parameters: any): Promise<string>
}