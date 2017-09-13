'use strict';
const ical = require('ical');
const moment = require('moment');

const EVENTS_URL = 'http://tietokilta.fi/kalenteri/ical';

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
            const event = eventsData[k];
            if(event.type === "VEVENT" && moment(event.end).isAfter()) {
                events.push(event);
            }
        }
    }

    const response = 'There are ' + events.length + ' upcoming events. ' +
        'Next one is ' + events[0].summary + ' on ' + moment(events[0].start).format('dddd, MMMM Do YYYY, h:mm a');

    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    res.send(JSON.stringify({ "speech": response, "displayText": response}));

});

exports.downloadEvents = functions.pubsub.topic('download-events').onPublish((event) => {
    return new Promise((resolve, reject) => {
        ical.fromURL(EVENTS_URL, {}, (err, data) => {
            if(err) {
                console.error("Couldn't download ICS", err);
                reject(err);
            } else {
                const events = {};
                for (var k in data) {
                    if (data.hasOwnProperty(k) && data[k].type === "VEVENT") {
                        const event = data[k];
                        k = k.replace('.', ',');
                        events[k] = event;
                    }
                }
                resolve(admin.database().ref('/').child('events').set(events));
            }
        });
    });
});
