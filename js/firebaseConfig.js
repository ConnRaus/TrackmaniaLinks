// Firebase initialization and database setup
const productionConfig = {
  apiKey: "AIzaSyAdIT47uDjDsOq8QRe2lwEkrNgJDI1GqFA",
  authDomain: "tmwebsitedb-2477d.firebaseapp.com",
  databaseURL: "https://tmwebsitedb-2477d-default-rtdb.firebaseio.com",
  projectId: "tmwebsitedb-2477d",
  storageBucket: "tmwebsitedb-2477d.appspot.com",
  messagingSenderId: "972124262825",
  appId: "1:972124262825:web:701d5b9752c025992b74b8",
};

firebase.initializeApp(productionConfig);

export const db = firebase.database();
