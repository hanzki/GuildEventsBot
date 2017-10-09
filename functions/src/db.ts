import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import {Moment} from "moment";
admin.initializeApp(functions.config().firebase);

export function get(path: string): Promise<any> {
    return admin.database().ref(path).once('value').then(snapshot => {
        return snapshot.val();
    });
}

export function set(path: string, value: any): Promise<void> {
    return admin.database().ref(path).set(value)
}

export function push(path: string, value: any): Promise<any> {
    return admin.database().ref(path).push(value);
}

export function remove(path: string): Promise<void> {
    return admin.database().ref(path).remove();
}

/**
 * Returns all events from the database that have endtime in the future
 */
export function getFutureAndOngoingEvents(): Promise<any> {
    return admin.database().ref('/events/')
        .orderByChild('end').startAt(moment().toJSON())
        .once('value').then(snapshot => {
            return snapshot.val();
        });
}

/**
 * Returns all events from the database that have endtime between given start and end dates
 */
export function getEventsEndingDuringAPeriod(start: Moment, end: Moment): Promise<any> {
    return admin.database().ref('/events/')
        .orderByChild('end').startAt(start.toJSON()).endAt(end.toJSON())
        .once('value').then(snapshot => {
            return snapshot.val();
        });

}