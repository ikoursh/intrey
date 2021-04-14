import React from "react";
import {Alert, Image, Platform, StyleSheet, TouchableHighlight} from "react-native";
import {auth} from "firebase";
import {User} from "@react-native-community/google-signin";
const GoogleAuthProvider = auth.GoogleAuthProvider;

export default function (props:any) {
    const styles = StyleSheet.create({
        google:{
            margin: 5,
            width: props.Gwidth,
            height:props.Gwidth*0.240837,
        }
    });
    if (Platform.OS == "ios" || Platform.OS=="android"){
        const GoogleSignInMOBILE = require("@react-native-community/google-signin");
        const GoogleSigninButton = GoogleSignInMOBILE.GoogleSigninButton;
        return <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={()=>{
                GoogleSignInMOBILE.GoogleSignin.configure();
                GoogleSignInMOBILE.GoogleSignin.signIn().then((u:User)=>{
                    return auth().signInWithCredential(auth.GoogleAuthProvider.credential(u.idToken));
                })
            }}
            disabled={props.disabled}
        />
    }
    return (
        <TouchableHighlight onPress={() => {
            if (!props.disabled){
                const gap = new GoogleAuthProvider();
                auth().signInWithPopup(gap);
            }
            else {Alert.alert("Please accept the terms and conditions first")}
        }}>
            <Image style={styles.google} source={require('../assets/signInWithGoogle.png')}/>
        </TouchableHighlight>

    )
}

