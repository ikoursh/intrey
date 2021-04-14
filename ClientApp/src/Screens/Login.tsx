import {auth} from "firebase";
import React, {useState} from 'react';
import {Dimensions, StyleSheet} from "react-native";
import {Button, Card, CheckBox, Divider, Input, Layout, Modal, Text} from "@ui-kitten/components";
import GoogleSignIn from "../Components/GoogleSignIn";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [err, setErr] = useState<string | null>(null);
    const win = Dimensions.get('window');
    const width = Math.min(win.width * 0.8, 500), height = 50;
    const Gwidth = Math.min(0.8 * width, 150);

    const styles = StyleSheet.create({
        container: {
            flex: 1, justifyContent: 'center', alignItems: 'center'
        },
        button: {
            margin: 5,
            width: width,
            height: height,
        },
        google: {
            margin: 5,
            width: Gwidth,
            height: Gwidth * 0.240837,
        },
        input: {
            width: width,
            height: height,
            margin: 10
        },
        checkbox: {
            margin: 10,
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },

    });


    return (<Layout style={styles.container}>
        <Text category={"h1"}>Login / Sign Up</Text>
        <Input label={"Email"} style={styles.input} accessibilityHint={"Email"} autoCompleteType={"email"}
               onChangeText={(text) => setEmail(text)}/>

        <Input label={"Password"} style={styles.input} accessibilityHint={"Password"} secureTextEntry={true}
               autoCompleteType={"password"}
               onChangeText={(text) => setPassword(text)}/>

        <Button style={styles.button} onPress={() => {

            auth()
                .createUserWithEmailAndPassword(email, password)
                .catch(error => {

                    switch (error.code) {
                        case 'auth/user-disabled':
                        case 'auth/operation-not-allowed':

                            setErr("Account suspended");
                            //TODO: handel account suspension
                            break;

                        case 'auth/weak-password':
                            setErr("Weak Password",);
                            break;
                        case "auth/invalid-email":
                            setErr("Invalid Email");
                            break;

                        case "auth/email-already-in-use":
                            setErr("Email already in use");
                            break;

                        default:
                            setErr(`Error ${error.code}`);
                            console.log(error.code);
                            break;
                    }

                });

        }}>Sign Up</Button>
        <Button
            style={styles.button} onPress={() => {

            auth()
                .signInWithEmailAndPassword(email, password)
                .catch(error => {

                    switch (error.code) {
                        case 'auth/user-disabled':

                            setErr("Account suspended",);//"If you think this is a mistake, please contact support."
                            //TODO: handel account suspension
                            break;

                        case 'auth/user-not-found':
                            setErr("User Not Found");//"Try signing up instead"
                            break;
                        case "auth/wrong-password":
                            setErr("wrong password");
                            break;
                        case "auth/invalid-email":
                            setErr("Invalid Email");
                            break;

                        default:
                            setErr(`Error: ${error.code}`);
                            console.log(error.code);
                            break;
                    }

                });

        }}>Log In </Button>

        <Divider/>

        <GoogleSignIn  Gwidth={Gwidth}/>


        <Modal
            visible={err != null}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setErr(null)}>
            <Card disabled={true}>
                <Text category={"h4"}>{err ?? ""}</Text>
                <Button onPress={() => setErr(null)}>
                    Dismiss
                </Button>
            </Card>
        </Modal>
    </Layout>);
}


