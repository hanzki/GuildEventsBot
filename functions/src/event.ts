import moment = require("moment");

export class Event {

    constructor(
        public uid: string,
        public start: string,
        public end: string,
        public summary: string,
        public description?: string,
        public location?: string
    ) {}

    static compareByStartTime(a: Event, b: Event): number {
        const aStart = moment(a.start);
        const bStart = moment(b.start);

        if(aStart.isBefore(bStart)) { return -1; }
        if(aStart.isAfter(bStart)) { return 1; }
        else { return 0; }
    }
}