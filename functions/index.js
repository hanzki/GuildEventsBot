'use strict';
const ical = require('ical');
const moment = require('moment');

const EVENTS_URL = 'http://tietokilta.fi/kalenteri/ical';

const functions = require('firebase-functions');

/*
* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.listEvents = functions.https.onRequest((req, res) => {

    const eventsData = ical.parseFile('events.ics');
    const events = [];

    for (var k in eventsData){
        if (eventsData.hasOwnProperty(k)) {
            const evnt = eventsData[k];
            if(evnt.type === "VEVENT" && moment(evnt.end).isAfter()) {
                events.push(evnt);
            }
        }
    }

    const response = 'There are ' + events.length + ' upcoming events. ' +
        'Next one is ' + events[0].summary + ' on ' + moment(events[0].start).format('dddd, MMMM Do YYYY, h:mm a');

    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    res.send(JSON.stringify({ "speech": response, "displayText": response}));

});
