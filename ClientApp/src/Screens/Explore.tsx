import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Divider,
    Icon,
    Input,
    Layout,
    List,
    ListItem,
    Spinner,
    Styles,
    StyleService,
    Text,
    TopNavigation,
    TopNavigationAction,
    useStyleSheet
} from "@ui-kitten/components";
import {createStackNavigator} from "@react-navigation/stack";
import {Image, KeyboardAvoidingView, Platform, View} from "react-native";
import {auth, firestore as db, storage} from "../Components/TabView";
import * as ImagePicker from 'expo-image-picker'
import {baseApiUrl} from "../firebase";
import AsyncStorage from "@react-native-community/async-storage"

type UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
type QuerySnapshot = firebase.firestore.QuerySnapshot;
type DocumentData = firebase.firestore.DocumentData;

let styles: Styles<any>;



export default function Explore() {
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
        item: {
            marginVertical: 8,
        },
        itemHeader: {
            minHeight: 220,
            padding: 24,
        },
        itemHeaderDetails: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },
        itemStyxContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 4,
            marginHorizontal: -8,
        },
        itemStyxText: {
            marginHorizontal: 16,
            marginVertical: 14,
        },
        itemStyxButton: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            borderRadius: 24,
        },
        itemDescription: {
            marginHorizontal: -8,
            marginTop: 16,
        },
        itemFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        itemReactionsContainer: {
            flexDirection: 'row',
        },
        itemAddButton: {
            flexDirection: 'row-reverse',
            paddingHorizontal: 0,
        },
        iconButton: {
            paddingHorizontal: 0,
        },
    }));

    const navigationOptions = {
        header: ({navigation}: any) => {
            return <><TopNavigation title={"Explore"} alignment={"center"}
                                    accessoryLeft={() => <TopNavigationAction onPress={navigation.goBack}
                                                                              icon={(props: any) => <Icon {...props}
                                                                                                          name={"arrow-back"}/>}/>}/>
                <Divider/></>
        }
    }
    const navigationOptionsMaster = {
        header: () => <TopNavigation alignment={"center"} title={"Explore"}/>
    }

    const Stack = createStackNavigator();
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{height: "100%"}}>

            <Stack.Navigator>
                <Stack.Screen name={"Categories"} component={Categories} options={navigationOptionsMaster}/>
                <Stack.Screen name={"Category"} component={Category} options={navigationOptions}/>
                <Stack.Screen name={"New Post"} component={NewPost} options={navigationOptions}/>


            </Stack.Navigator>
        </KeyboardAvoidingView>
    )
}

function Category({route, navigation}: any) {

    const [maxBias, setMaxBias] = useState(5)
    const [minBias, setMinBias] = useState(5)
    AsyncStorage.getItem("maxBias").then((r)=>setMaxBias(r?parseInt(r):5));
    AsyncStorage.getItem("minBias").then((r)=>setMinBias(r?parseInt(r):5));

    const category: Category = route.params.c;
    const [posts, setPosts] = useState<PostInterface[] | null>(null);

    useEffect(() => {
        (async () => {
            if (posts == null) {
                const bias = (await db.collection("Users").doc(auth.currentUser?.uid).get()).data()?.bias ?? 0;
                console.log(`getting posts in range ${bias - minBias}<x<${bias + maxBias}`);
                setPosts(await Promise.all((await db.collection("PostCategories").doc(category.id).collection("Posts")
                    .where("bias", "<", bias + maxBias).where("bias", ">", bias - minBias).get()).docs.map(async (d: any) => {
                        d = d.data();
                        console.log(d.img)
                        return {
                            title: d.title,
                            content: d.content,
                            uid: d.uid,
                            img: !d.img || d.img == "null" ? null : await storage.ref(`images/${d.img}.jpeg`).getDownloadURL().catch(() => null) ?? null,
                            bias: Math.round(d.bias),
                        }
                    }
                )));
            }
        })()
    });

    return (
        <Layout level={"2"} style={posts == null ? styles.myChatsLoading : styles.myChats}>

            {posts == null ? <Spinner/> :
                <List data={posts} ItemSeparatorComponent={Divider} renderItem={({item}: { item: PostInterface }) => {
                    console.log(item)
                    return (

                        <Card
                            style={{marginVertical: 8}}
                            footer={renderItemFooter}>
                            <Layout
                                style={styles.itemStyxContainer}
                                level='2'>
                                <Text
                                    style={styles.itemStyxText}
                                    category='h6'>
                                    {item.title}
                                </Text>
                                <Button
                                    style={styles.itemStyxButton}
                                    size='tiny'>
                                    {`User bias score: ${item.bias}`}
                                </Button>
                            </Layout>
                            {item.img ? <Image source={item.img} style={{width: "100%", height: 500}}
                                               resizeMode="contain"/> : <></>}

                            <Text
                                style={styles.itemDescription}
                                category='s1'>
                                {item.content}
                            </Text>
                        </Card>)
                }}/>}

            <Button size={"large"} accessoryLeft={(props: any) => (
                <Icon {...props} name='plus-outline'/>
            )} style={styles.newChat} onPress={() => {
                navigation.navigate("New Post", {"c": category})
            }}/>
        </Layout>
    )
}


const renderItemFooter = (): React.ReactElement => (
    <View style={styles.itemFooter}>
        <View style={styles.itemReactionsContainer}>
            {/*    <Button*/}
            {/*        style={styles.iconButton}*/}
            {/*        appearance='ghost'*/}
            {/*        status='basic'*/}
            {/*        accessoryLeft={() => <Icon name='share-outline'/>}*/}
            {/*    />*/}
            {/*    <Button*/}
            {/*        style={styles.iconButton}*/}
            {/*        appearance='ghost'*/}
            {/*        status='basic'*/}
            {/*        accessoryLeft={() => <Icon name='heart-outline'/>}*/}
            {/*    />*/}
        </View>
    </View>
);


const pushid = require('pushid')

function NewPost({route, navigation}: any) {
    const category: Category = route.params.c;
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [imgPath, setImgPath] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [dissabled, setDisabled] = useState(false);
    // @ts-ignore
    return (<Layout level={"3"} style={styles.myChatsLoading}>
        <Card style={{width: "95%"}}>
            <Input label={"Title"} value={title} onChangeText={setTitle}/>
            <Input label={"Content"} value={content} onChangeText={setContent} multiline={true} numberOfLines={5}/>
            <Button onPress={async () => {
                setDisabled(true)
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    quality: 1,
                    base64: true
                });

                console.log(result);

                if (!result.cancelled) {
                    setImage(result.uri);
                    let path = pushid();
                    storage.ref().child(`/images/${path}.jpeg`).putString(result.uri, 'data_url').then((r: UploadTaskSnapshot) => {
                        setDisabled(false);
                        setImgPath(path)
                        console.log("upload complete", r)
                    });
                } else {
                    setDisabled(false)
                }

            }
            }>Attach Image</Button>
            {image == null ? <></> : <><Image source={{uri: image}} style={{width: 200, height: 200}}/></>}
            <Button disabled={dissabled} onPress={async () => {
                setDisabled(true);
                fetch(baseApiUrl + `/${category.id}/addPost`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content,
                        token: await auth.currentUser?.getIdToken(),
                        img: imgPath ?? "null"
                    })
                });
                navigation.navigate("Category", {c: category})
            }}>Post</Button>
        </Card>
    </Layout>)

}

function processCategory(d: any): Category {
    return {
        description: d.data().description,
        title: d.data().title,
        id: d.id
    }
}

function Categories({navigation}: any) {
    // setTitle("Categories");
    const [categories, setCategories] = useState<Category[] | null>(null);
    useEffect(() => {
        if (categories == null) {
            db.collection("PostCategories").get().then(async (data: QuerySnapshot<DocumentData>) => {
                let t = (await Promise.all(data.docs.map(processCategory)));
                console.log(t)
                setCategories(t);
            })
        }
    })

    return (<Layout level={"2"} style={categories == null ? styles.myChatsLoading : styles.myChats}>

        {
            categories == null ? <Spinner/> :
                <>
                    <Divider/>
                    <List data={categories}

                          renderItem={({item}: { item: Category }) => (
                              <ListItem title={item.title} description={item.description} onPress={() => {
                                  navigation.navigate("Category", {c: item}); //navigate to chat and pass the chat item as a prop
                              }}/>)} ItemSeparatorComponent={Divider}/></>}


    </Layout>)
}


interface Category {
    title: string,
    description: string,
    id: string
}

interface PostInterface {
    title: string,
    content: string,
    uid: string,
    img: any,
    bias: number
}
