<template>
    <div class="rate">
        <md-card v-if="!user">
            <md-card-area>

                <md-card-header>
                    <div class="md-title">Login</div>
                </md-card-header>

                <md-card-content>
                    Login met je Google account.
                </md-card-content>
            </md-card-area>

            <md-card-actions>
                <md-button @click="login">Login</md-button>
            </md-card-actions>
        </md-card>
        <ul
            v-sortable:users="{ animation: 200 }"
            v-if="user">
            <li v-for="u in users">
                <md-card>
                    <md-card-header>
                        <md-avatar>
                            <img alt="People" :src="u.photo">
                        </md-avatar>
                        <div class="md-title">{{ u.name }}</div>
                        <div class="md-subhead">Subtitle here</div>
                    </md-card-header>
                </md-card>
            </li>
        </ul>
        <ul v-sortable:list="{ animation: 200 }">
            <li v-for="item in list">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() { 
        return {
            user: firebase.auth().currentUser,
            users: [],
            list: ['Foo', 'Bar', 'Baz']
        }
    },
    
    mounted() {
          if (!this.user) {
          }
    },
    
    methods: {
        onUpdate: function (event) {
            this.list.splice(event.newIndex, 0, this.list.splice(event.oldIndex, 1)[0])
        },
        login () {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((result) => {
                    this.saveUser(result.user);                    
                });
        },
        
        saveUser (user) {
            this.user = user;
            
            // get users
            firebase.database().ref('users').once('value')
                .then((snapshot) => {
                    let users = snapshot.val();
                    for (var key in users) {
                        users[key].key = key;
                        this.users.push(users[key]);
                    }
                });
            
            // save the user as a person that will be in the poll
            firebase.database().ref('users/'+ user.uid).set({
                name: user.displayName,
                photo: user.photoURL,
                email: user.email
            });
            
            // bind ratings of firebase to rating
            this.$bindAsArray(
                'rating',
                firebase.database().ref('ratings/'+ user.uid)
            );
        },
        
        sort (event) {
            this.users.splice(event.newIndex, 0, this.users.splice(event.oldIndex, 1)[0]);
            
            this.saveRating();
        },
        
        saveRating () {
            
            // save the new order of users as rating
            this.$firebaseRefs.rating.set(
                this.users.map((user) => {
                    return {
                        user: user.key,
                        email: user.email
                    }
                })
            );
        }
    }
}
</script>

<style lang="scss">
.rate {
    margin: 0 auto;
    width: 600px;
}
</style>
