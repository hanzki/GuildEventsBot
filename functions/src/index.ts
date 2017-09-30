import * as functions from 'firebase-functions';

import * as intents from './intents';
import * as guildEvents from './guild-events'

exports.listEvents = functions.https.onRequest(async (req, res) => {
    const intent = req && req.body && req.body.result && req.body.result.metadata && req.body.result.metadata.intentName;
    const parameters = req && req.body && req.body.result && req.body.result.parameters || {};

    let response: string;
    switch (intent) {
        case 'guild.list_events':
            const params = {};
            if(parameters.date) {
                params['date'] = parameters.date;
            }
            if(parameters['date-period']) {
                params['period'] = parameters['date-period'];
            }
            response = await intents.listEvents(params);
            break;
        default:
            response = 'Sorry, I don\'t know what you are talking about';
    }

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

exports.testDownloadEvents = functions.https.onRequest(async (req, res) => {
    await guildEvents.fetchNewEvents();
    res.send('done');
});

exports.downloadEvents = functions.pubsub.topic('hourly-tick').onPublish((event) => {
    return guildEvents.fetchNewEvents();
});

