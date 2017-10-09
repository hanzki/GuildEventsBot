
import {Intent} from "./intent";
import moment = require("moment");
import * as guildEvents from '../guild-events';
import { Event } from '../event';
import {Moment} from "moment";

export class ListEventsIntent extends Intent{

    private EVENT_DESCRIPTION_MAX_LENGTH = 140;

    async makeResponse(parameters): Promise<string> {
        if(parameters.date) {
            return await this.listEventsForDate(moment(parameters.date));
        }
        if(parameters['date-period']) {
            const [start, end] = parameters['date-period'].split('/');
            return await this.listEventsForPeriod(moment(start), moment(end));
        }
        return await this.listUpcoming();
    }

    private async listEventsForDate(date: Moment): Promise<string> {
        const start = moment(date).startOf('day');
        const end = moment(date).endOf('day');
        const events = await guildEvents.eventsDuringPeriod(start, end);

        if (events && events.length) {
            let response = `Here are Tietokilta events happening on ${date.format('dddd, DD.MM')}:` ;
            for (let i = 0; i < events.length && i < 5; i++) {
                response += '\n\n' + this.eventDescription(events[i]);
            }
            return response;
        } else {
            return `There are no Tietokilta events happening on ${date.format('dddd, DD.MM')}`;
        }

    }

    private async listEventsForPeriod(start: Moment, end: Moment): Promise<string> {
        const events = await guildEvents.eventsDuringPeriod(start.startOf('day'), end.endOf('day'));

        if (events && events.length) {
            let response = `Here are Tietokilta events happening between ${start.format('dddd, DD.MM')} and ${end.format('dddd, DD.MM')}:` ;
            for (let i = 0; i < events.length && i < 5; i++) {
                response += '\n\n' + this.eventDescription(events[i]);
            }
            return response;
        } else {
            return `There are no Tietokilta events happening between ${start.format('dddd, DD.MM')} and ${start.format('dddd, DD.MM')}`;
        }

    }

    private async listUpcoming(): Promise<string> {
        const events = await guildEvents.upcomingEvents();

        let response = 'Here are upcoming Tietokilta events:';
        for (let i = 0; i < events.length && i < 5; i++) {
            response += '\n\n' + this.eventDescription(events[i]);
        }

        return response;
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