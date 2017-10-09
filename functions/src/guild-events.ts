import * as moment from 'moment';
import * as ical from 'ical';
import * as db from './db';

import { Event } from './event';
import { Moment } from "moment";
import * as assert from "assert";

const EVENTS_URL = 'http://tietokilta.fi/kalenteri/ical';

export async function upcomingEvents(): Promise<Event[]> {
    const eventsFromDB: any = await db.getFutureAndOngoingEvents();

    const events: Event[] = [];

    for (const k in eventsFromDB) {
        if (eventsFromDB.hasOwnProperty(k)) {
            const event = eventsFromDB[k];
            if(moment(event.end).isAfter()) {
                events.push(event as Event);
            }
        }
    }

    return events.sort(Event.compareByStartTime);
}

export async function eventsDuringPeriod(start: Moment, end: Moment): Promise<Event[]> {
    assert.ok(start.isSameOrBefore(end), 'start must be same or before end');

    // The end time is increased to make sure that all events that start during the period are fetched from the database.
    const eventsFromDB: any = await db.getEventsEndingDuringAPeriod(start, moment(end).add(5, 'days'));

    const events: Event[] = [];

    for (const k in eventsFromDB) {
        if (eventsFromDB.hasOwnProperty(k)) {
            const event = eventsFromDB[k];
            if(moment(event.start).isBetween(start, end) || start.isBetween(event.start, event.end)) {
                events.push(event as Event);
            }
        }
    }

    return events.sort(Event.compareByStartTime);
}

export function fetchNewEvents(): Promise<void> {
    return new Promise((resolve, reject) => {
        ical.fromURL(EVENTS_URL, {}, (err, eventsData) => {
            if(err) {
                console.error("Couldn't download ICS", err);
                reject(err);
            } else {
                const firebaseEvents = {};
                for (let k in eventsData) {
                    if (eventsData.hasOwnProperty(k) && eventsData[k].type === "VEVENT") {
                        const event = eventsData[k];
                        k = k.replace('.', ',');
                        firebaseEvents[k] = {
                            uid: event.uid || null,
                            start: event.start && event.start.toJSON() || null,
                            end: event.end && event.end.toJSON() || null,
                            summary: event.summary || null,
                            description: event.description || null,
                            location: event.location || null,
                        };
                    }
                }
                resolve(db.set('/events', firebaseEvents));
            }
        });
    }).then(() => {});
}