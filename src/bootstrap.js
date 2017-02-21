/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

window.Vue = require('vue');
Vue.use(require('vuefire'));
/**
 * A sortable library that vue will use as directive. It allows lists to be
 * sorted for an easy way to rank people with vue components
 */

import Sortable from 'sortablejs';
import draggable from 'vuedraggable';
// 
// Vue.directive('sortable', {
//     inserted: function (el, binding) {
//         new Sortable(el, binding.value || {})
//     },
//     
// })

/**
 * A library with components that will build of a pretty interface and an
 * easy time implementing them. Makes for faster development and well 
 * build interactive elements to play with.
 */

var VueMaterial = require('vue-material');
Vue.use(VueMaterial)

/**
 * Add firebase, it's our storage library wich allows to show the data
 * realtime aswell as writing it. It has build-in authentication
 */

 window.firebase = require("firebase/app");
 require("firebase/auth");
 require("firebase/database");