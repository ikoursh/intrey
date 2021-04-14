import React, {useEffect, useState} from 'react';
import {
    Button,
    Divider,
    Icon,
    Input,
    Layout,
    List,
    ListItem,
    Spinner,
    StyleService,
    Text,
    TopNavigation,
    TopNavigationAction,
    useStyleSheet
} from "@ui-kitten/components";
import {Keyboard, KeyboardAvoidingView, Platform, View} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import firebase from "firebase";
import {baseApiUrl, getAuth} from "../firebase";
import {auth, firestore as db} from "../Components/TabView";
type QuerySnapshot = firebase.firestore.QuerySnapshot;
type DocumentData = firebase.firestore.DocumentData;

let calls1 = 0, calls3 = 0;
let styles: any;

interface Message {
    foreign: boolean,
    msg: string,
    timeStamp: Date;
}

const msgConverter = {
    toFirestore(msg: Message): firebase.firestore.DocumentData {
        return {
            msg: msg.msg,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            UID: auth.currentUser?.uid
        }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Message {
        const data = snapshot.data(options)
        console.log(data)
        return {
            foreign: data.UID != auth.currentUser?.uid,
            msg: data.msg,
            timeStamp: data.timeStamp.toDate(),
        }
    }
}

function Chat({route}: any) {
    const [msg, setMsg] = useState("");
    const chat: Chat = route.params.chat;
    setTitle(chat.name)
    return <Layout level={"2"} style={{flex: 1}}>
        <ChatMsgs chat={chat}/>
        <Input multiline={true} onChangeText={setMsg} value={msg}/>
        <Button onPress={() => {
            Keyboard.dismiss();
            db.collection("Chats").doc(chat.CID).collection("Messages").withConverter(msgConverter).add(
                {msg: msg, timeStamp: new Date(), foreign: false}
            )
            setMsg("");
        }
        }>Send</Button>
    </Layout>
}

function ChatMsgs({chat}: { chat: Chat }) {
    const [messages, setMessages] = useState<Message[] | null>(null)
    React.useEffect(() => {
        if (messages == null) {
            const unsubscribe = db.collection("Chats").doc(chat.CID).collection("Messages").orderBy("timeStamp").withConverter(msgConverter).limitToLast(20).onSnapshot((dataSnapshot:QuerySnapshot<Message>) => {
                calls3++;
                if (calls3 > 50) {
                    console.error("max call exceeded, quitting")
                    unsubscribe();
                }
                setMessages(dataSnapshot.docs.map((msgSnapshot) => msgSnapshot.data({serverTimestamps: "estimate"})));
            });
            // return unsubscribe;
        }
    }, [messages, setMessages])

    if (messages == null)
        return <Layout level={"2"} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Spinner/></Layout>

    return (<>
        <Divider/>
        <List data={messages}
              renderItem={({item}: { item: Message }) => (
                  <View style={styles.msgContainer}>
                      <View style={item.foreign ? styles.sentByOther : styles.sentByMe}>
                          <Text style={styles.msgText} category={"p1"}>{item.msg}</Text>
                          <Text style={styles.msgText} category={"s2"}>{item.timeStamp.toTimeString()}</Text>

                      </View>
                  </View>

              )}/>
    </>);

}

let title: string, setTitle: Function;
export default function DMs() {
    styles = useStyleSheet(StyleService.create({
        newChat: {
            position: "absolute",
            right: "3%",
            bottom: "3%",
        },

        myChats: {
            flex: 1
        },

        myChatsLoading: {
            flex: 1,
            justifyContent: 'center', alignItems: 'center'
        },
        sentByMe: {
            backgroundColor: "color-success-default",
            maxWidth: "80%",
            borderRadius: 5,
            alignSelf: "flex-end",
            margin: 10,
            padding: 7,

        },
        sentByOther: {
            backgroundColor: "#dcdcdc",
            maxWidth: "80%",
            borderRadius: 5,
            alignSelf: "flex-start",
            margin: 10,
            padding: 7,
        },
        msgContainer: {
            width: "100%"
        }
        ,
        msgText: {
            color: "#000",
            margin: 2
        }
    }));
    [title, setTitle] = useState("New Chat");
    const navigationOptions = {
        header: ({navigation}: any) => {
            return <><TopNavigation title={title} alignment={"center"}
                                    accessoryLeft={() => <TopNavigationAction onPress={navigation.goBack}
                                                                              icon={(props:any) => <Icon {...props}
                                                                                                     name={"arrow-back"}/>}/>}/>
                <Divider/></>
        }
    }
    const navigationOptionsMaster = {
        header: () => <TopNavigation alignment={"center"} title={"My Chats"}/>
    }

    const Stack = createStackNavigator();
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{height: "100%"}}>

            <Stack.Navigator>
                <Stack.Screen name={"Chats"} component={Chats} options={navigationOptionsMaster}/>
                <Stack.Screen name={"New Chat"} component={NewChat} options={navigationOptions}/>
                <Stack.Screen name={"Chat"} component={Chat} options={navigationOptions}/>

            </Stack.Navigator>
        </KeyboardAvoidingView>
    )
}

interface Chat {
    uid: string,
    name: string,
    bio: string,
    CID: string,
}

async function processChat(documentData: any) {
    let otherUserData = (await db.collection("Users").doc(documentData.id).get()).data();
    calls1++;
    if (otherUserData)
        return {
            uid: documentData.id,
            name: otherUserData.userName,
            bio: otherUserData.bio,
            CID: documentData.data().ref,
        }
}

function defined<T>(arg: T | undefined): arg is T {
    return arg !== undefined;
}

function Chats({navigation}: any) {

    const [chats, setChats] = useState<null | Chat[]>(null);
    useEffect(() => {
        if (chats == null) {
            console.log("getting chats")
            const unsubscribe = db.collection("Users").doc(auth.currentUser?.uid).collection("Chats").limit(10).onSnapshot(
                async (data:QuerySnapshot<DocumentData>) => {
                    console.log("GOT CHATS")
                    calls1 += 1;
                    console.log(calls1, data.empty, data)
                    if (calls1 > 51) {
                        console.error("Failed to unsubscribe, panicking")
                        throw new Error("PANIC 1")
                    }

                    if (calls1 > 50) {
                        unsubscribe();
                        console.error("TO MANNY CALLS TO DB: QUITTING")
                        return;
                    }

                    let pdata = (await Promise.all(data.docs.map(processChat)));

//remove undefined elements
                    setChats(pdata.filter(defined));

                })
        }
    });


    return <Layout level={"2"} style={chats == null || chats.length == 0 ? styles.myChatsLoading : styles.myChats}>
        {
            chats == null ? <Spinner/> :
                (chats?.length == 0 ? (<>
                        <Text style={{textAlign: "center", margin: 20}} category={"h2"}>You don't have any chats
                            yet</Text>
                        <Text category={"s1"}>Press on the + button to create some</Text>
                    </>) :
                    (<><Divider/>
                        <List data={chats}

                              renderItem={({item}: { item: Chat }) => (
                                  <ListItem title={item.name} description={item.bio} onPress={() => {
                                      navigation.navigate("Chat", {chat: item}); //navigate to chat and pass the chat item as a prop
                                  }}/>)} ItemSeparatorComponent={Divider}/></>))}


        <Button size={"large"} accessoryLeft={(props:any) => (
            <Icon {...props} name='plus-outline'/>
        )} style={styles.newChat} onPress={() => {
            navigation.navigate("New Chat")
        }}/>
    </Layout>
}


function NewChat({navigation}: any) {
    setTitle("New Chat")
    const [showCancel, setShowChancel] = useState(false);
    const [called, setCalled] = useState(false)
    useEffect(() => {
        if (!called)
            (async () => {
                    setCalled(true);
                    let resp = await fetch(baseApiUrl + `/newChat`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            token: await auth.currentUser?.getIdToken()
                        })
                    })
                    let r = await resp.json();
                    if (r.link == "pending") {
                        setShowChancel(true);
                        let rmvListen = db.collection("Users").doc(auth.currentUser.uid).onSnapshot((d) => {
                            if (d.data().newChatLink != "pending") {
                                rmvListen()
                                db.collection("Users").doc(auth.currentUser.uid).update({
                                    newChatLink: "pending",
                                    newChatUID: "pending",
                                    newChatName: "pending"
                                });
                                navigation.navigate("Chat", {
                                    chat:
                                        {
                                            CID: d.data().newChatLink,
                                            uid: d.data().newChatUID,
                                            bio: d.data().newChatBio,
                                            name: d.data().newChatName
                                        }
                                })
                            }
                        });
                    } else {
                        let x: Chat;
                        x = {CID: r.link, uid: r.uid, bio: r.bio, name: r.name}
                        navigation.navigate("Chat", {chat: x})
                    }
                }
            )()
    })

    return (<Layout level={"2"} style={styles.myChatsLoading}>
        <Spinner/>
        <Button disabled={!showCancel} onPress={async () => {
            setShowChancel(false);
            fetch(baseApiUrl + `/cancelChat`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: await auth.currentUser?.getIdToken()
                })
            });
            navigation.navigate("Chats")
        }}>Cancel</Button>
    </Layout>)
}
