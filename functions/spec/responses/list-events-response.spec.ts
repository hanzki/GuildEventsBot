import moment = require("moment");
import { expect } from 'chai';
import * as mock from 'mock-require';

const fakeGuildEvents =  [
        {
            uid: '3',
            start: moment('2017-10-09').subtract(1, 'hour').toJSON(),
            end: moment('2017-10-09').add(1, 'hour').toJSON(),
            summary: 'Ongoing event',
            description: 'Blaah blaah event description',
            location: 'Guild Room'
        },
        {
            uid: '1',
            start: moment('2017-10-09').add(1, 'day').toJSON(),
            end: moment('2017-10-09').add(1, 'day').add(2, 'hours').toJSON(),
            summary: 'Unit Testing 101',
            description: 'Introduction to the wonders of unit testing',
            location: 'Guild Room'
        },
        {
            uid: '5',
            start: moment('2017-10-09').add(4, 'days').toJSON(),
            end: moment('2017-10-09').add(4, 'days').add(3, 'hours').toJSON(),
            summary: 'No description or location'
        },
        {
            uid: '4',
            start: moment('2017-10-09').add(4, 'months').toJSON(),
            end: moment('2017-10-09').add(4, 'months').add(3, 'hours').toJSON(),
            summary: 'Event far in the future',
            description: 'We are all going to die someday',
            location: 'The great outdoors'
        }
];

import { ListEventsResponse } from "../../src/responses/list-events-response";

describe('ListEventsResponse', () => {

    describe('no events', () => {
        it('without start or end', () => {
            const expectedResponse = "Sadly there are no upcoming Tietokilta events.";
            const response = new ListEventsResponse([]);
            const responseString = response.toString();
            expect(responseString).equal(expectedResponse);
        });

        it('with start', () => {
            const expectedResponse = "There are no Tietokilta events happening on Monday, 09.10";
            const response = new ListEventsResponse([], moment('2017-10-09'));
            const responseString = response.toString();
            expect(responseString).equal(expectedResponse);
        });

        it('with start and end', () => {
            const expectedResponse = "There are no Tietokilta events happening between Monday, 09.10 and Tuesday, 10.10";
            const response = new ListEventsResponse([], moment('2017-10-09'), moment('2017-10-10'));
            const responseString = response.toString();
            expect(responseString).equal(expectedResponse);
        });
    });

    describe('few events', () => {
        it('without start or end', () => {
            const expectedResponse = [
                "Here are upcoming Tietokilta events:",
                "",
                "*Sun 08.10 - Ongoing event*",
                "\\[23:00 - 01:00] _Guild Room_",
                "Blaah blaah event description",
                "[More Info](http://tietokilta.fi/tapahtumat/)",
                "",
                "*Tue 10.10 - Unit Testing 101*",
                "\\[00:00 - 02:00] _Guild Room_",
                "Introduction to the wonders of unit testing",
                "[More Info](http://tietokilta.fi/tapahtumat/)",
                "",
                "*Fri 13.10 - No description or location*",
                "\\[00:00 - 03:00] _ _",
                "No description",
                "[More Info](http://tietokilta.fi/tapahtumat/)",
                "",
                "*Fri 09.02 - Event far in the future*",
                "\\[00:00 - 03:00] _The great outdoors_",
                "We are all going to die someday",
                "[More Info](http://tietokilta.fi/tapahtumat/)",
            ].join('\n');
            const response = new ListEventsResponse(fakeGuildEvents);
            const responseString = response.toString();
            expect(responseString).equal(expectedResponse);
        })
    })

});