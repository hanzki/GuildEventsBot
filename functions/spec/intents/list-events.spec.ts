import moment = require("moment");
import { expect } from 'chai';
import * as mock from 'mock-require';

const fakeGuildEvents = {
    upcomingEvents: async () => [
        {
            uid: '3',
            start: moment().subtract(1, 'hour').toJSON(),
            end: moment().add(1, 'hour').toJSON(),
            summary: 'Ongoing event',
            description: 'Blaah blaah event description',
            location: 'Guild Room'
        },
        {
            uid: '1',
            start: moment().add(1, 'day').toJSON(),
            end: moment().add(1, 'day').add(2, 'hours').toJSON(),
            summary: 'Unit Testing 101',
            description: 'Introduction to the wonders of unit testing',
            location: 'Guild Room'
        },
        {
            uid: '5',
            start: moment().add(4, 'days').toJSON(),
            end: moment().add(4, 'days').add(3, 'hours').toJSON(),
            summary: 'No description or location'
        },
        {
            uid: '4',
            start: moment().add(4, 'months').toJSON(),
            end: moment().add(4, 'months').add(3, 'hours').toJSON(),
            summary: 'Event far in the future',
            description: 'We are all going to die someday',
            location: 'The great outdoors'
        }
    ]
};

mock('../../src/guild-events', fakeGuildEvents);

import { ListEventsIntent } from '../../src/intents/list-events';

describe('ListEventsIntent', () => {
    const intent = new ListEventsIntent();

    describe('makeResponse()', () => {
        it('should form response', async () => {
            const response = await intent.makeResponse({});
            expect(typeof(response)).equal('string');
            expect(response.length).greaterThan(0);
        })
    })

});