import { Response } from "./response";
import { Event } from "../event";
import { Moment } from "moment";
import moment = require("moment");

export class ListEventsResponse extends Response {

    private EVENT_DESCRIPTION_MAX_LENGTH = 140;
    private MAX_EVENTS_PER_RESPONSE = 5;
    private PARAGRAPH_SEPARATOR = '\n\n';

    private events: Event[];
    private date: Moment;
    private period: {start: Moment, end: Moment};

    constructor(events: Event[], start?: Moment, end?: Moment) {
        super();

        this.events = events;

        if(start && end) {
            this.period = {start: start, end: end}
        } else if (start) {
            this.date = start;
        }
    }

    toString(): string {
        if(this.events && this.events.length) {
            return this.listIntroduction() + this.PARAGRAPH_SEPARATOR + this.eventsList();
        }
        else {
            return this.noEventsMessage();
        }

    }

    private listIntroduction(): string {
        if(this.period) {
            return `Here are Tietokilta events happening between ${this.period.start.format('dddd, DD.MM')} and ${this.period.end.format('dddd, DD.MM')}:`;
        }
        else if (this.date) {
            return `Here are Tietokilta events happening on ${this.date.format('dddd, DD.MM')}:`;
        }
        else {
            return 'Here are upcoming Tietokilta events:';
        }
    }

    private noEventsMessage(): string {
        if(this.period) {
            return `There are no Tietokilta events happening between ${this.period.start.format('dddd, DD.MM')} and ${this.period.end.format('dddd, DD.MM')}`;
        }
        else if (this.date) {
            return `There are no Tietokilta events happening on ${this.date.format('dddd, DD.MM')}`;
        }
        else {
            return "Sadly there are no upcoming Tietokilta events.";
        }
    }

    private eventsList(): string {
        return this.events
            .slice(0, this.MAX_EVENTS_PER_RESPONSE)
            .map((event) => this.eventDescription(event))
            .join(this.PARAGRAPH_SEPARATOR);
    }

    private eventDescription(e: Event): string {
        let description;
        if(e.description && e.description.length > this.EVENT_DESCRIPTION_MAX_LENGTH) {
            description = e.description.substring(0, this.EVENT_DESCRIPTION_MAX_LENGTH) + '...';
        } else {
            description = e.description || 'No description';
        }

        const link = Event.eventLink(e);

        return [
            `*${moment(e.start).format('ddd DD.MM')} - ${e.summary}*`,
            `\\[${moment(e.start).format('HH:mm')} - ${moment(e.end).format('HH:mm')}] _${e.location || ' '}_`,
            `${description}`,
            `[More Info](${link})`
        ].join('\n');
    }
}