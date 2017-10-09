import * as functions from 'firebase-functions';

import * as guildEvents from './guild-events'
import {ListEventsIntent} from "./intents/list-events-intent";
import {Intent} from "./intents/intent";
import {UnknownIntent} from "./intents/unknown-intent";
import {Response} from "./responses/response";

exports.listEvents = functions.https.onRequest(async (req, res) => {
    const intent = getIntent(req);
    const parameters = getIntentParameters(req);

    const response: Response = intent.makeResponse(parameters);
    const responseString = response.toString();

    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    res.send(JSON.stringify({
        speech: responseString,
        displayText: responseString,
        data: {
            telegram: {
                text: responseString,
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

