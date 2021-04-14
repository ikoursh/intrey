import React from 'react';
import {Layout, Spinner} from "@ui-kitten/components";

export default function SplashScreen() {
    return(<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner/>
    </Layout>)
}