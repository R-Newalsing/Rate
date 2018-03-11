require('./bootstrap');

const config = {

};

firebase.initializeApp(config);
window.db = firebase.database();

Vue.component('draggable', require('vuedraggable'));
Vue.component('rate', require('./components/rate.vue'));
Vue.component('top', require('./components/top.vue'));
Vue.component('result', require('./components/result.vue'));

const app = new Vue({
    el: '#app'
});
