import * as functions from 'firebase-functions';

import * as guildEvents from './guild-events'
import {ListEventsIntent} from "./intents/list-events";
import {Intent} from "./intents/intent";
import {UnknownIntent} from "./intents/unknown";

exports.listEvents = functions.https.onRequest(async (req, res) => {
    const intent = getIntent(req);
    const parameters = getIntentParameters(req);

    const response = intent.makeResponse(parameters);

    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    res.send(JSON.stringify({
        speech: response,
        displayText: response,
        data: {
            telegram: {
                text: response,
                parse_mode: 'Markdown'
            }
        }}));
});

function getIntent(request): Intent {
    try {
        return intentForIntentName(request.body.result.metadata.intentName);
    } catch (err) {
        return new UnknownIntent();
    }
}

function intentForIntentName(intentName: string): Intent {
    switch (intentName) {
        case 'guild.list_events':
            return new ListEventsIntent();
        default:
            return new UnknownIntent();
    }
}

function getIntentParameters(request) {
    try {
        return request.body.result.parameters;
    } catch (err) {
        return {};
    }
}

exports.testDownloadEvents = functions.https.onRequest(async (req, res) => {
    await guildEvents.fetchNewEvents();
    res.send('done');
});

exports.downloadEvents = functions.pubsub.topic('hourly-tick').onPublish((event) => {
    return guildEvents.fetchNewEvents();
});

