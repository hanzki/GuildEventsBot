import * as moment from 'moment';
import * as functions from 'firebase-functions';

import * as guildEvents from './guild-events';

/*
* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.listEvents = functions.https.onRequest(async (req, res) => {
    const events = await guildEvents.upcomingEvents();

    const response = 'There are ' + events.length + ' upcoming events. ' +
        'Next one is ' + events[0].summary + ' on ' + moment(events[0].start).format('dddd, MMMM Do YYYY, h:mm a');

    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    res.send(JSON.stringify({ "speech": response, "displayText": response}));
});

exports.testDownloadEvents = functions.https.onRequest(async (req, res) => {
    await guildEvents.fetchNewEvents();
    res.send('done');
});

exports.downloadEvents = functions.pubsub.topic('hourly-tick').onPublish((event) => {
    return guildEvents.fetchNewEvents();
});

