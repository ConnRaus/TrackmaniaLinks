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

const testingConfig = {
  apiKey: "AIzaSyCHKuvrT6Nv6uWUycDh6AqKx6FAaNfpuOk",
  authDomain: "tmwebsitedbtestserver.firebaseapp.com",
  databaseURL: "https://tmwebsitedbtestserver-default-rtdb.firebaseio.com",
  projectId: "tmwebsitedbtestserver",
  storageBucket: "tmwebsitedbtestserver.appspot.com",
  messagingSenderId: "161872471958",
  appId: "1:161872471958:web:dec4d41ecb48e762199fb7",
};

firebase.initializeApp(productionConfig);

export const db = firebase.database();
