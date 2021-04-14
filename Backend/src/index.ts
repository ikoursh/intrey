import bias, {initialize} from "./bias";
import {Request, Response} from 'express';
const fs = require('fs');
const https = require('https');
initialize().then(() => bias("test"))


// Certificate
const privateKey = fs.readFileSync('keys/privkey.pem', 'utf8');
const certificate = fs.readFileSync('keys/cert.pem', 'utf8');
const ca = fs.readFileSync('keys/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const express = require('express')
let app = express();// Setup server port
const port = process.env.PORT || 443;// Send message for default URL
app.use(express.json())
const cors = require('cors');
const corsOptions = {
    origin: ["https://meet-social-media-sq.web.app", "https://meet-social-media-sq.firebaseapp.com"],
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

const allowedCatagories = ["Israeli Palestinian Conflict"];

const admin = require("firebase-admin");
const serviceAccount = require("../key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth()
const maxBias = 5, minBias = 0;
app.post('/api/:category/addPost', async function (req: Request, res: Response) {
    const {category} = req.params;
    if (!allowedCatagories.includes(category)) {
        res.status(404).send("Category not found")
    }
    const user = (await auth.verifyIdToken(req.body.token));
    if (!user.email_verified) {
        res.status(400).send("Verify email")//todo: fix statuss
    }
    if (req.body.title.isEmpty || req.body.content.isEmpty) {
        res.status(400).send("Please fill all fields")
    }
    const postBias = bias(req.body.content);
    const userData = (await db.collection("Users").doc(user.uid).get()).data();
    const update = db.collection("Users").doc(user.uid).update({
        "bias": (userData.bias ?? 0) * 0.95 + (await postBias) * 0.05
    })
    let o = await db.collection("PostCategories").doc(category).collection("Posts").add({
        title: req.body.title,
        content: req.body.content,
        uid: user.uid,
        bias: await postBias,
        date: admin.firestore.FieldValue.serverTimestamp(),
        img: req.body.img,
    });
    await update;

    res.status(200).send(o.id);
});

const usersWaiting: User[] = []
app.post('/api/newChat', async function (req: Request, res: Response) {
    console.log(usersWaiting)
    const user = (await auth.verifyIdToken(req.body.token));
    const userData = (await db.collection("Users").doc(user.uid).get()).data();
    const bias = userData.bias ?? 0;
    let existingUserChats = null;
    for (let i = 0; i < usersWaiting.length; i++) {
        if (usersWaiting[i].uid == user.uid) {
            res.status(200).send({link: "pending"}) // fail gracefully if user is already in.
            return;
        }
        let relBias = Math.abs(usersWaiting[i].bias - bias)
        console.log(relBias)
        if (relBias > minBias && relBias < maxBias) {
            console.log("possible match")
            const other = usersWaiting.splice(i)[0];

            if (existingUserChats == null) {
                existingUserChats = await (await db.collection("Users").doc(user.uid).collection("Chats").get()).docs.map((d: any) => d.id)
            }
            if (!(other.uid in existingUserChats)) {
                console.log("match")
                const link = await db.collection("Chats").add({
                    UID_A: user.uid,
                    UID_B: other.uid
                });
                db.collection("Users").doc(user.uid).update({newChatLink: link.id, newChatUID: other.uid, newChatBio: other.bio, newChatName: other.name});
                db.collection("Users").doc(user.uid).collection("Chats").doc(other.uid).set({ref: link.id});
                db.collection("Users").doc(other.uid).collection("Chats").doc(user.uid).set({ref: link.id});
                res.status(200).send({link: link, uid: other.uid, name: other.name, bio: other.bio});
                return;
            }

        }
    }
    usersWaiting.push({uid: user.uid, bias: bias, name: userData.userName, bio: userData.bio});
    //Set the users link to pending:
    db.collection("Users").doc(user.uid).update({newChatLink: "pending"})
    res.status(200).send({link: "pending"});
})


app.post('/api/cancelChat', async function (req: Request, res: Response) {
    const user = (await auth.verifyIdToken(req.body.token));

    for (let i = 0; i < usersWaiting.length; i++) {
        if (usersWaiting[i].uid == user.uid) {
            usersWaiting.splice(i);
            res.status(200).send();
        }
    }
    res.status(404).send();
})

interface User {
    uid: string,
    bias: number,
    name: string,
    bio: string,
}


const server = https.createServer(credentials, app);

server.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
