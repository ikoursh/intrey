import firebase from "firebase";

let db: firebase.firestore.Firestore;
let auth: firebase.auth.Auth;
let storage:firebase.storage.Storage;

export async function getAuth() {
    if (auth == null){
        auth = await firebase.auth();
    }
    return auth;
}

export async function getDb() {
    if (db == null){
        await require('firebase/firestore');
        db = firebase.firestore()
    }
    return db;
}

export async function getStorage() {
    if (storage == null){
        await require('firebase/storage');
        storage = firebase.storage();
    }
    return storage;
}

export const baseApiUrl = "https://intry.inbarkoursh.com/api";