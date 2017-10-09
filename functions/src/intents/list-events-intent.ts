import {Intent} from "./intent";
import moment = require("moment");
import * as guildEvents from '../guild-events';
import {Moment} from "moment";
import { Response } from "../responses/response";
import {ListEventsResponse} from "../responses/list-events-response";

export class ListEventsIntent extends Intent{

    async makeResponse(parameters): Promise<Response> {
        if(parameters.date) {
            return await this.listEventsForDate(moment(parameters.date));
        }
        if(parameters['date-period']) {
            const [start, end] = parameters['date-period'].split('/');
            return await this.listEventsForPeriod(moment(start), moment(end));
        }
        return await this.listUpcoming();
    }

    private async listEventsForDate(date: Moment): Promise<Response> {
        const start = moment(date).startOf('day');
        const end = moment(date).endOf('day');

        const events = await guildEvents.eventsDuringPeriod(start, end);

        return new ListEventsResponse(events, date);
    }

    private async listEventsForPeriod(start: Moment, end: Moment): Promise<Response> {
        const events = await guildEvents.eventsDuringPeriod(start.startOf('day'), end.endOf('day'));

        return new ListEventsResponse(events, start, end);
    }

    private async listUpcoming(): Promise<Response> {
        const events = await guildEvents.upcomingEvents();

        return new ListEventsResponse(events);
    }
}