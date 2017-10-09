import * as mock from 'mock-require';
import * as moment from 'moment';
import {Moment} from "moment";

let _values;
let pushCount;
reset();

export function reset() {
    _values = {};
    pushCount = 0;
}

export function has(path: string): boolean {
    return _values.hasOwnProperty(path);
}

export function get(path: string): Promise<string> {
    if (!_values.hasOwnProperty(path)) {
        return Promise.resolve(null);
    }
    return Promise.resolve(_values[path]);
}

export function set(path: string, value: any): Promise<void> {
    _values[path] = value;
    return Promise.resolve();
}

export function push(path: string, value: any): Promise<any> {
    _values[`${path}/pushprefix-${pushCount}`] = value;
    pushCount++;
    return Promise.resolve();
}

export function remove(path: string): Promise<void> {
    delete _values[path];
    return Promise.resolve();
}

export function values() {
    return _values;
}

export function init(otherModule: string) {
    mock(otherModule, './fake-db');
}

export function getFutureAndOngoingEvents() {
    return this.get('/events/')
        .then(events => {
            const filteredEvents = {};
            for (let k in events) {
                if(events.hasOwnProperty(k) && moment().isBefore(events[k].end)) {
                    filteredEvents[k] = events[k];
                }
            }
            return filteredEvents;
        });
}

export function getEventsEndingDuringAPeriod(start: Moment, end: Moment) {
    return this.get('/events/')
        .then(events => {
            const filteredEvents = {};
            for (let k in events) {
                if(events.hasOwnProperty(k) && start.isBefore(events[k].end) && end.isAfter(events[k].end)) {
                    filteredEvents[k] = events[k];
                }
            }
            return filteredEvents;
        });
}