import React, {Suspense, useEffect, useState} from 'react';
import firebase from "firebase/app";
import {firestore, User} from "firebase";

import SplashScreen from "./Screens/SplashScreen";

import {ApplicationProvider, Button, Card, IconRegistry, Modal, Text} from "@ui-kitten/components";
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import AsyncStorage from "@react-native-community/async-storage"

import Login from "./Screens/Login"
import {getAuth} from "./firebase";

const SignUp = React.lazy(() => import("./Screens/SignUp"));
const TabView = React.lazy(() => import("./Components/TabView"));

const firebaseConfig = {
    apiKey: "AIzaSyBbxrDo4__NyCEPx4E7obc1_hjTPa_lyK4",
    authDomain: "meet-social-media-sq.firebaseapp.com",
    projectId: "meet-social-media-sq",
    storageBucket: "meet-social-media-sq.appspot.com",
    messagingSenderId: "857597138191",
    appId: "1:857597138191:web:4e77094b1b1b9179619a7a",
    measurementId: "G-WJ37007H2T"
};


if (firebase.apps.length === 0) //TODO: remove in production
    firebase.initializeApp(firebaseConfig)

let hasDbEntry: boolean | null, setHasDbEntry: Function;
let user: User | null, setUser: Function;


export function checkForUserDbEntry() {
    if (!user) {
        setHasDbEntry(false);
        return;
    }
    firestore().collection("Users").doc(user?.uid).get()
        .then((docSnapshot) => {
            setHasDbEntry(docSnapshot.exists);
        });
}


function App() {

    const [initializing, setInitializing] = useState(true);
    [user, setUser] = useState<User | null>(null);
    [hasDbEntry, setHasDbEntry] = useState(null);
    const [showEmailVerfReq, setShowEmailVerfReq] = useState(false);

    // Handle user state changes
    async function onAuthStateChanged(user: User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
        if (!(user?.emailVerified ?? false) && user) {
            user?.sendEmailVerification();
            (await getAuth()).signOut();
            setShowEmailVerfReq(true);
        } else {
            console.log("logged in, making req to firebase")
            checkForUserDbEntry()
        }

    }

    useEffect(() => {
        (async () => {
            (await getAuth()).onAuthStateChanged(onAuthStateChanged)
        })
        ();
    }, []);

    if (initializing) return (
        <SplashScreen/>
    );

    if (user == null || (!user?.emailVerified ?? false)) {
        return (
            <Suspense fallback={<SplashScreen/>}>
                <Login/>
                <Modal
                    visible={showEmailVerfReq}
                    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                    onBackdropPress={() => setShowEmailVerfReq(false)}>
                    <Card disabled={true}>
                        <Text category={"h4"}>Please verify your email address</Text>
                        <Button onPress={() => setShowEmailVerfReq(false)}>
                            OK
                        </Button>
                    </Card>
                </Modal>
            </Suspense>
        );
    }

    if (hasDbEntry == null) {
        return <SplashScreen/>
    }

    if (!hasDbEntry) {
        return (
            <Suspense fallback={<SplashScreen/>}>
                <SignUp/></Suspense>)
    }


    return (
        <Suspense fallback={<SplashScreen/>}>
            <TabView/></Suspense>
    );
}

let theme, setTheme: Function;

export function setThemeSafe(dark: boolean) {
    AsyncStorage.setItem("theme", dark ? "dark" : "light");
    setTheme(dark ? eva.dark : eva.light);
}

export default function () {
    [theme, setTheme] = useState(eva.light);
    const r = AsyncStorage.getItem('theme').then((r) => {
        if (r != null)
            setTheme(r == "dark" ? eva.dark : eva.light);
    });
    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider {...eva} theme={theme}>
                <App/>
            </ApplicationProvider>
        </>
    )
}


