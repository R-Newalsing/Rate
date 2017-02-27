<template>
    <md-whiteframe md-tag="md-toolbar" md-elevation="2">
        <md-toolbar>
            <h2 class="md-title" style="flex: 1">Rewi</h2>
            <md-avatar v-if="user">
                <img alt="People" :src="user.photoURL">
            </md-avatar>
        </md-toolbar>
    </md-whiteframe>
</template>

<script>
export default {
    data () {
        return {
            user: firebase.auth().currentUser
        }
    },
    
    mounted() {
        var that = this;
        // bind ratings of firebase to rating
        
        firebase.auth().onAuthStateChanged(function(user) {
            that.user = user;
        });
    },
}
</script>

<style lang="scss">
    .md-toolbar {
        flex: 1;
    }
</style>
