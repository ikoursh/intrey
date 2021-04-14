import React, {useState} from 'react';
import {Button, Layout, Text, Toggle} from "@ui-kitten/components";
import {auth, firestore} from "firebase";
import AsyncStorage from "@react-native-community/async-storage"
import {setThemeSafe} from "../App";
import Slider from "@react-native-community/slider";

export default function MyAccount() {
    const [name, setName] = useState("...");
    const [darkMode, setDarkMode] = useState(false)
    const [minRange, setMinRange] = useState(5)
    const [maxRange, setMaxRange] = useState(5)

    AsyncStorage.getItem('theme').then((r) => {
        setDarkMode(r ? r == "dark" : false);
    })
    AsyncStorage.getItem("minBias").then((r) => {
        setMinRange(r ? parseInt(r) : 5);
    });
    AsyncStorage.getItem("maxBias").then((r) => setMaxRange(r ? parseInt(r) : 5));


    firestore().collection("Users").doc(auth().currentUser?.uid).get().then((data) => {
        if (data.data() != undefined) { // @ts-ignore
            setName(data.data()["userName"])
        }
    })

    return (<Layout level={"2"} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text category={"h4"}>Welcome {name}</Text>
        <Button onPress={() => {
            auth().signOut();
        }}>Sign Out</Button>

        <Text category={"s1"}>Dark mode</Text>
        <Toggle checked={darkMode} onChange={(d) => {
            setThemeSafe(d);
            setDarkMode(d);
        }}/>

        <Text category={"s1"}>Maximum polarization range to display posts</Text>
        <Slider
            minimumValue={5}
            maximumValue={20}
            step={1}
            value={maxRange}
            style={{width: 200, height: 40, flexGrow:0}}
            onSlidingComplete={(v: number) => {
                // setMaxRange(v);
                AsyncStorage.setItem("maxBias", String(v))
            }}
        />


        <Text category={"s1"}>Minimum polarization range to display posts</Text>
        <Slider
            style={{width: 200, height: 40, flexGrow:0}}
            minimumValue={0}
            maximumValue={20}
            step={1}
            value={minRange}
            onSlidingComplete={(v: number) => {
                // setMinRange(v);
                AsyncStorage.setItem("minBias", String(v))
            }}
        />


    </Layout>)
}
