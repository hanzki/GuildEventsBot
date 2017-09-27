import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export function get(path: string): Promise<string> {
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

export function transaction(path: string, callback): Promise<any> {
    return admin.database().ref(path).transaction(callback);
}