import * as moment from 'moment';
import * as ical from 'ical';
import * as db from './db';

import { Event } from './event';

const EVENTS_URL = 'http://tietokilta.fi/kalenteri/ical';

export async function upcomingEvents(): Promise<Event[]> {
    const eventsFromDB: any = await db.get('/events/');

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

export function fetchNewEvents(): Promise<void> {
    return new Promise((resolve, reject) => {
        ical.fromURL(EVENTS_URL, {}, (err, eventsData) => {
            if(err) {
                console.error("Couldn't download ICS", err);
                reject(err);
            } else {
                const inserts = [];
                for (let k in eventsData) {
                    if (eventsData.hasOwnProperty(k) && eventsData[k].type === "VEVENT") {
                        const event = eventsData[k];
                        k = k.replace('.', ',');
                        const firebaseEvent = {
                            uid: event.uid || null,
                            start: event.start && event.start.toJSON() || null,
                            end: event.end && event.end.toJSON() || null,
                            summary: event.summary || null,
                            description: event.description || null,
                            location: event.location || null,
                        };
                        inserts.push(db.set('/events/' + k, firebaseEvent));
                    }
                }
                resolve(Promise.all(inserts));
            }
        });
    }).then(() => {});
}