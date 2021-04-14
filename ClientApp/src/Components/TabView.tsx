import React, {Suspense, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab, Icon, Spinner} from '@ui-kitten/components';


const MyAccount = React.lazy(() => import("../Screens/MyAccount"));
const Explore = React.lazy(() => import("../Screens/Explore"));
const DMs = React.lazy(() => import("../Screens/DMs"));

import SplashScreen from "../Screens/SplashScreen";
import firebase from "firebase";
import {getAuth, getStorage, getDb} from "../firebase";

const {Navigator, Screen} = createBottomTabNavigator();

// @ts-ignore
const BottomTabBar = ({navigation, state}) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Explore' icon={(props) => (
            <Icon {...props} name='home-outline'/>
        )}/>

        {/*<BottomNavigationTab title='Search' icon={(props) => (*/}
        {/*    <Icon {...props} name='search-outline'/>*/}
        {/*)}/>*/}

        <BottomNavigationTab title='Messages' icon={(props) => (
            <Icon {...props} name='message-square-outline'/>
        )}/>

        <BottomNavigationTab title='My Account' icon={(props) => (
            <Icon {...props} name='person-outline'/>
        )}/>

    </BottomNavigation>
);
export let firestore: firebase.firestore.Firestore;
export let auth: firebase.auth.Auth;
export let storage: firebase.storage.Storage;
export default function TabView() {
    //ensure that firebase deps are loaded to prevent async hell
    let waiting:Promise<any>[] = []
    waiting.push(getDb().then((r) => firestore = r));
    waiting.push(getAuth().then((r) => auth = r));
    waiting.push(getStorage().then((r) => storage = r));

    const [loading, setLoading] = useState(true);
    Promise.all(waiting).then(()=>setLoading(false))
    if (loading)
        return <Spinner/>

    return (
        <NavigationContainer>
            <Navigator tabBar={props => <BottomTabBar {...props} />}>
                <Screen name={"Explore"}
                        component={() => (<Suspense fallback={<SplashScreen/>}><Explore/></Suspense>)}/>
                {/*<Screen name={"Search"} component={Search}/>*/}
                <Screen name={"Messages"} component={() => (<Suspense fallback={<SplashScreen/>}><DMs/></Suspense>)}/>
                <Screen name={"My Account"}
                        component={() => (<Suspense fallback={<SplashScreen/>}><MyAccount/></Suspense>)}/>
            </Navigator>
        </NavigationContainer>
    )
}