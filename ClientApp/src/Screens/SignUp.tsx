import React, {useState} from "react";
import {Button, ButtonGroup, Card, Input, Layout, Text, CheckBox, Spinner} from "@ui-kitten/components";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import firebase, {auth} from "firebase";
import {checkForUserDbEntry} from "../App";
import {getDb} from "../firebase";

const pages = [
    userName,
    qu,
    results,
    Bio,]
let Uname: string, setUname: Function;
let quiz: string, setQuiz: Function;
let bio: string, setBio: Function;
let checked: boolean, setChecked: Function;
let page: number, setPage: Function;
let text: String, setText: Function;
let tandc: boolean, setTandC: Function;
let chosenStmnt:number, setChosenStmnt:Function

const questions = [
    {
        left: "Social programs and government intervention - focus on equality",
        right: "Reduced government spending, free market - focus on freedom"
    },
    {
        left: "For affirmative action",
        right: "Against affirmative action"
    },
    {
        left: "Strengthen environmental protection laws",
        right: "Let the free market run it's course"
    },
    {
        left: "Allow illegal immigrants paths to citizenship",
        right: "Illegal immigrants pose an economical and cultural threat"
    },
    {
        left: "For public healthcare ",
        right: "For private healthcare"
    },
    {
        left: "In favor of free access to abortion ",
        right: "Against abortion rights in general"
    },

    {
        left: "For LGBTQ rights",
        right: "Against LGBTQ rights"
    },
    {
        left: "In favor gun control",
        right: "Against gun control"
    },
    {
        left: "For separation of religion and state",
        right: "For traditionalism and religious conservatism"
    },
    {
        left: "For palestinian independence",
        right: "For annexation"
    },
    {
        left: "Against new settlements",
        right: "For new settlements"
    },
];

let count = 0;
let totalScore = 0;

//enter your username
function userName() {
    return <Layout level={'2'} style={styles.tab}>
        <Card style={styles.card}>
            <Text category={"h2"} style={styles.text}>What should we call
                you?</Text>
            <Text category={"s1"} style={styles.text}>This is your public
                username</Text>
            <Input autoCompleteType={"username"} onChangeText={(v: string) => setUname(v)}/>
        </Card>
        <Button style={styles.button} onPress={() => setPage(page + 1)}>Next</Button>

    </Layout>
}


//presents the two statements you need to choose from
function qu() {
    if (chosenStmnt == 0)
        return <Layout level={'2'} style={styles.tab}>
            <Card>
                <Text style={styles.text}>
                    {count+1}
                </Text>
                <Text category={"h2"} style={styles.text}>
                    Select the statement most suited to your worldview
                </Text>
                <Text category={"s1"} style={styles.text}>
                    let's detect where you stand on the political spectrum
                </Text>
                <Button onPress={() => setChosenStmnt(-1)}>{questions[count].left}</Button>
                <Button onPress={() => setChosenStmnt(1)}>{questions[count].right}</Button>
            </Card>
            <Button status={"danger"} disabled={count<1} style={styles.button} onPress={()=>setPage(page+1)}>Skip</Button>
        </Layout>

    const updateScore = (score: number) => {
        totalScore += score;
        count++;
        setChosenStmnt(0);
        if (count==questions.length){
            setPage(page+1);
        }
    }
    return <Layout level={'2'} style={styles.tab}>
        <Card>
            <Text style={styles.text}>
                {count + 1}
            </Text>
            <Text category={"s1"} style={styles.text}>
                To what extent do you agree with the statement you chose?
            </Text>

            <ButtonGroup style={styles.buttonGroup}>
                <Button onPress={() => updateScore(chosenStmnt * (0.25))}>I have my doubts</Button>
                <Button onPress={() => updateScore(chosenStmnt * (0.5))}>somewhat agree</Button>
                <Button onPress={() => updateScore(chosenStmnt * (0.75))}>strongly agree</Button>
                <Button onPress={() => updateScore(chosenStmnt * (1))}>completely agree</Button>
            </ButtonGroup>
        </Card>
        {console.log("in evaluate")}
    </Layout>
}

function results() {
    return <Layout level={'2'} style={styles.tab}>
        <Card>
            <Text style={styles.text} category={"h1"}>
                Your bias score:
            </Text>
            <Text style={{alignContent:"center"}} catagory={"h4"}>{Math.round((totalScore / count) * 30)}</Text>
        </Card>
        <Button style={styles.button} onPress={() => setPage(page + 1)}>Next</Button>
    </Layout>
}

//in charge of submitting everything
function Bio() {
    return <Layout level={'2'} style={styles.tab}>
        <Card style={styles.card}>
            {/* in text can do sth called category- tells ur to apply this style */}
            {/* not importinng text from ui  */}
            <Text style={styles.text} category={"h1"}>Tell us a bit about yourself</Text>
            <Text style={styles.text} category={"s1"}>Your public Bio</Text>

            <Input style={styles.multiLine} onChangeText={(v: string) => setBio(v)}/>
        </Card>
        {/* button to be green */}
        {/* this returns a js promise once its done it promises fundementslyy return user */}


        <CheckBox checked={tandc} onChange={(val: boolean) => {
            setTandC(val)
        }}>I agree to the terms and conditions, as well as Intrey's privacy policy</CheckBox>

        <Button status={"success"} style={styles.button} disabled={!tandc} onPress={() => {
            console.log(Uname, bio)
            db.collection("Users").doc(auth().currentUser?.uid).set({
                userName: Uname,
                bio: bio,
                bias: (totalScore / count) * 30,
            }).then(checkForUserDbEntry);
        }}>Finish</Button>

    </Layout>
}


let db: firebase.firestore.Firestore;
//mainly initially displayed -adding question by adding new functions
export default function () {
    const [loaded, setLoaded] = useState(false);
    [page, setPage] = useState(0);

    [Uname, setUname] = useState("");
    [quiz, setQuiz] = useState("");
    [bio, setBio] = useState("");
    [text, setText] = useState('Press any button');
    [checked, setChecked] = useState(false);
    [tandc, setTandC] = useState(false);
    [chosenStmnt, setChosenStmnt] = useState(0);

    getDb().then((r) => {
        db = r;
        setLoaded(true)
    });


    return (
        // keyboards are buggy to make sure the screen moves up
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{height: "100%"}}>
            {loaded ? pages[page]() : <Spinner/>}
        </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
    tab: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    button: {
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    multiLine: {
        minHeight: 100,
        width: 300,
    },
    card: {
        justifyContent: 'center', alignItems: 'center',
        minHeight: "30%"
    },
    text: {margin: 10, textAlign: "center"},
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonGroup: {
        margin: 2,
        marginTop: 4,
        flexDirection: 'column',
        alignItems: 'center',

    },

});
