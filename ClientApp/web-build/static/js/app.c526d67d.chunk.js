(this.webpackJsonp=this.webpackJsonp||[]).push([[1],{108:function(e,t,n){"use strict";n.d(t,"b",(function(){return s})),n.d(t,"c",(function(){return d})),n.d(t,"d",(function(){return m})),n.d(t,"a",(function(){return f}));var a,r,i,l=n(22),c=n.n(l),o=n(34),u=n.n(o);function s(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=r){e.next=4;break}return e.next=3,c.a.awrap(u.a.auth());case 3:r=e.sent;case 4:return e.abrupt("return",r);case 5:case"end":return e.stop()}}),null,null,null,Promise)}function d(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=a){e.next=4;break}return e.next=3,c.a.awrap(n(319));case 3:a=u.a.firestore();case 4:return e.abrupt("return",a);case 5:case"end":return e.stop()}}),null,null,null,Promise)}function m(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=i){e.next=4;break}return e.next=3,c.a.awrap(n(320));case 3:i=u.a.storage();case 4:return e.abrupt("return",i);case 5:case"end":return e.stop()}}),null,null,null,Promise)}var f="https://intry.inbarkoursh.com/api"},136:function(e,t,n){"use strict";n.d(t,"a",(function(){return U})),n.d(t,"c",(function(){return M}));var a=n(1),r=n.n(a),i=n(22),l=n.n(i),c=n(40),o=n.n(c),u=n(0),s=n.n(u),d=n(122),m=n.n(d),f=n(34),h=n(68),b=n(26),p=n(56),g=n(194),E=n(120),w=n.n(E),k=n(28),v=n(10),y=n(91),x=n(46),P=n(32),S=n(94),j=f.auth.GoogleAuthProvider,I=function(e){var t=v.a.create({google:{margin:5,width:e.Gwidth,height:.240837*e.Gwidth}});if("ios"==P.a.OS||"android"==P.a.OS){var a=n(814),r=a.GoogleSigninButton;return s.a.createElement(r,{style:{width:192,height:48},size:r.Size.Wide,color:r.Color.Dark,onPress:function(){a.GoogleSignin.configure(),a.GoogleSignin.signIn().then((function(e){return Object(f.auth)().signInWithCredential(f.auth.GoogleAuthProvider.credential(e.idToken))}))},disabled:e.disabled})}return s.a.createElement(S.a,{onPress:function(){if(e.disabled)y.a.alert("Please accept the terms and conditions first");else{var t=new j;Object(f.auth)().signInWithPopup(t)}}},s.a.createElement(x.a,{style:t.google,source:n(318)}))};function O(){var e=Object(u.useState)(""),t=o()(e,2),n=t[0],a=t[1],r=Object(u.useState)(""),i=o()(r,2),l=i[0],c=i[1],d=Object(u.useState)(null),m=o()(d,2),h=m[0],p=m[1],g=k.a.get("window"),E=Math.min(.8*g.width,500),w=Math.min(.8*E,150),y=v.a.create({container:{flex:1,justifyContent:"center",alignItems:"center"},button:{margin:5,width:E,height:50},google:{margin:5,width:w,height:.240837*w},input:{width:E,height:50,margin:10},checkbox:{margin:10},backdrop:{backgroundColor:"rgba(0, 0, 0, 0.5)"}});return s.a.createElement(b.Layout,{style:y.container},s.a.createElement(b.Text,{category:"h1"},"Login / Sign Up"),s.a.createElement(b.Input,{label:"Email",style:y.input,accessibilityHint:"Email",autoCompleteType:"email",onChangeText:function(e){return a(e)}}),s.a.createElement(b.Input,{label:"Password",style:y.input,accessibilityHint:"Password",secureTextEntry:!0,autoCompleteType:"password",onChangeText:function(e){return c(e)}}),s.a.createElement(b.Button,{style:y.button,onPress:function(){Object(f.auth)().createUserWithEmailAndPassword(n,l).catch((function(e){switch(e.code){case"auth/user-disabled":case"auth/operation-not-allowed":p("Account suspended");break;case"auth/weak-password":p("Weak Password");break;case"auth/invalid-email":p("Invalid Email");break;case"auth/email-already-in-use":p("Email already in use");break;default:p("Error "+e.code),console.log(e.code)}}))}},"Sign Up"),s.a.createElement(b.Button,{style:y.button,onPress:function(){Object(f.auth)().signInWithEmailAndPassword(n,l).catch((function(e){switch(e.code){case"auth/user-disabled":p("Account suspended");break;case"auth/user-not-found":p("User Not Found");break;case"auth/wrong-password":p("wrong password");break;case"auth/invalid-email":p("Invalid Email");break;default:p("Error: "+e.code),console.log(e.code)}}))}},"Log In "),s.a.createElement(b.Divider,null),s.a.createElement(I,{Gwidth:w}),s.a.createElement(b.Modal,{visible:null!=h,backdropStyle:y.backdrop,onBackdropPress:function(){return p(null)}},s.a.createElement(b.Card,{disabled:!0},s.a.createElement(b.Text,{category:"h4"},null!=h?h:""),s.a.createElement(b.Button,{onPress:function(){return p(null)}},"Dismiss"))))}var C,T,A,G,W,B,z=n(108),D=s.a.lazy((function(){return n.e(9).then(n.bind(null,912))})),L=s.a.lazy((function(){return Promise.all([n.e(4),n.e(7)]).then(n.bind(null,845))}));function U(){var e;A?Object(f.firestore)().collection("Users").doc(null==(e=A)?void 0:e.uid).get().then((function(e){T(e.exists)})):T(!1)}function q(){var e,t,n=Object(u.useState)(!0),a=o()(n,2),r=a[0],i=a[1],c=Object(u.useState)(null),d=o()(c,2);A=d[0],G=d[1];var m=Object(u.useState)(null),f=o()(m,2);C=f[0],T=f[1];var p=Object(u.useState)(!1),g=o()(p,2),E=g[0],w=g[1];function k(e){var t;return l.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(G(e),r&&i(!1),null!=(t=null==e?void 0:e.emailVerified)&&t||!e){n.next=10;break}return null==e||e.sendEmailVerification(),n.next=6,l.a.awrap(Object(z.b)());case 6:n.sent.signOut(),w(!0),n.next=12;break;case 10:console.log("logged in, making req to firebase"),U();case 12:case"end":return n.stop()}}),null,null,null,Promise)}return Object(u.useEffect)((function(){l.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.awrap(Object(z.b)());case 2:e.sent.onAuthStateChanged(k);case 3:case"end":return e.stop()}}),null,null,null,Promise)}),[]),r?s.a.createElement(h.a,null):null==A||null!=(e=!(null!=(t=A)&&t.emailVerified))&&e?s.a.createElement(u.Suspense,{fallback:s.a.createElement(h.a,null)},s.a.createElement(O,null),s.a.createElement(b.Modal,{visible:E,backdropStyle:{backgroundColor:"rgba(0, 0, 0, 0.5)"},onBackdropPress:function(){return w(!1)}},s.a.createElement(b.Card,{disabled:!0},s.a.createElement(b.Text,{category:"h4"},"Please verify your email address"),s.a.createElement(b.Button,{onPress:function(){return w(!1)}},"OK")))):null==C?s.a.createElement(h.a,null):C?s.a.createElement(u.Suspense,{fallback:s.a.createElement(h.a,null)},s.a.createElement(L,null)):s.a.createElement(u.Suspense,{fallback:s.a.createElement(h.a,null)},s.a.createElement(D,null))}function M(e){w.a.setItem("theme",e?"dark":"light"),B(e?p.dark:p.light)}0===m.a.apps.length&&m.a.initializeApp({apiKey:"AIzaSyBbxrDo4__NyCEPx4E7obc1_hjTPa_lyK4",authDomain:"meet-social-media-sq.firebaseapp.com",projectId:"meet-social-media-sq",storageBucket:"meet-social-media-sq.appspot.com",messagingSenderId:"857597138191",appId:"1:857597138191:web:4e77094b1b1b9179619a7a",measurementId:"G-WJ37007H2T"});t.b=function(){var e=Object(u.useState)(p.light),t=o()(e,2);W=t[0],B=t[1];w.a.getItem("theme").then((function(e){null!=e&&B("dark"==e?p.dark:p.light)}));return s.a.createElement(s.a.Fragment,null,s.a.createElement(b.IconRegistry,{icons:g.EvaIconsPack}),s.a.createElement(b.ApplicationProvider,r()({},p,{theme:W}),s.a.createElement(q,null)))}},197:function(e,t,n){n(198),e.exports=n(199)},198:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/expo-service-worker.js",{scope:"/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},199:function(e,t,n){"use strict";n.r(t);var a=n(815),r=n(136);Object(a.a)(r.b)},318:function(e,t,n){e.exports=n.p+"static/media/signInWithGoogle.eb4d92af.png"},68:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(0),r=n.n(a),i=n(26);function l(){return r.a.createElement(i.Layout,{style:{flex:1,justifyContent:"center",alignItems:"center"}},r.a.createElement(i.Spinner,null))}}},[[197,2,3]]]);
//# sourceMappingURL=app.c526d67d.chunk.js.map