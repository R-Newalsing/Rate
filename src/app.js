require('./bootstrap');

const config = {
    apiKey: "AIzaSyBBDOcqvSiw8JUCD50ZQ-qtTY-Q5HudkNE",
    authDomain: "rate-your-colleague.firebaseapp.com",
    databaseURL: "https://rate-your-colleague.firebaseio.com",
    storageBucket: "rate-your-colleague.appspot.com",
    messagingSenderId: "878714293648"
};

firebase.initializeApp(config);
window.db = firebase.database();

Vue.component('rate', require('./components/rate.vue'));
Vue.component('draggable', require('vuedraggable'));

const app = new Vue({
    el: '#app'
});