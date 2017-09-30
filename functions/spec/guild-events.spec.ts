import { expect } from 'chai';
import * as moment from 'moment';

// Use a fake database.
import * as fakedb from './fake-db';
fakedb.init('../src/db');

// Use a fake Firebase configuration.
import * as fakeconfig from './fake-config';
fakeconfig.init();

// Use a fake Firebase Admin.
import * as fakeadmin from './fake-admin';
fakeadmin.init();

// Ready to go!
import * as guildEvents from '../src/guild-events';
import { Event } from "../src/event";

// Test data
const testEvents: any = {
    '1': {
        uid: '1',
        start: moment().add(1, 'day').toJSON(),
        end: moment().add(1, 'day').add(2, 'hours').toJSON(),
        summary: 'Unit Testing 101',
        description: 'Introduction to the wonders of unit testing',
        location: 'Guild Room'
    },
    '2': {
        uid: '2',
        start: moment().subtract(2, 'day').toJSON(),
        end: moment().subtract(2, 'day').add(2, 'hours').toJSON(),
        summary: 'Past Event',
        description: 'Long time ago in a galaxy far far away...',
        location: 'Space'
    },
    '3': {
        uid: '3',
        start: moment().subtract(1, 'hour').toJSON(),
        end: moment().add(1, 'hour').toJSON(),
        summary: 'Ongoing event',
        description: 'Blaah blaah event description',
        location: 'Guild Room'
    },
    '4': {
        uid: '4',
        start: moment().add(4, 'months').toJSON(),
        end: moment().add(4, 'months').add(3, 'hours').toJSON(),
        summary: 'Event far in the future',
        description: 'We are all going to die someday',
        location: 'The great outdoors'
    },
    '5': {
        uid: '5',
        start: moment().add(4, 'days').toJSON(),
        end: moment().add(4, 'days').add(3, 'hours').toJSON(),
        summary: 'No description or location'
    }
};

describe('Guild Events', () => {
    beforeEach(async () => {
        fakedb.reset();
        await fakedb.set('/events/', testEvents);
    });

    describe('upcomingEvents()', () => {

        it('should return list of all upcoming events', async() => {
            const events: Event[] = await guildEvents.upcomingEvents();
            expect(Array.isArray(events)).equal(true);
            expect(events.length).equal(4);
        });

        it('should not return past events', async() => {
            const events: Event[] = await guildEvents.upcomingEvents();
            expect(Array.isArray(events)).equal(true);
            expect(events.indexOf(testEvents['2'])).equal(-1);
        });

        it('should return list sorted by start time', async() => {
            const events: Event[] = await guildEvents.upcomingEvents();
            expect(Array.isArray(events)).equal(true);
            for(let i = 0; i < events.length - 1; i++) {
                expect(moment(events[i].start).isSameOrBefore(events[i+1].start)).equal(true);
            }
        });

    });

    describe('eventsDuringPeriod(start, end)', () => {

        it('should return events overlapping period', async () => {
            const start = moment().add(4, 'days').startOf('day');
            const end = moment().add(4, 'days').endOf('day');
            const events: Event[] = await guildEvents.eventsDuringPeriod(start, end);
            expect(Array.isArray(events)).equal(true);
            expect(events.length).equal(1);
            expect(events[0]).equal(testEvents['5']);
        });
    })
});