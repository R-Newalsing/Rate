<template>
    <div class="rate">
        <md-card
            class="question">
            <md-card-header>
                <div class="md-title">De vraag</div>
            </md-card-header>
        </md-card>
        
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
        <draggable
            :list="users"
            @update="saveRating"
            v-if="user">
            <md-card v-for="u in users">
                <md-card-header>
                    <md-avatar>
                        <img alt="People" :src="u.photo">
                    </md-avatar>
                    <div class="md-title">{{ u.name }}</div>
                    <div class="md-subhead">Subtitle here</div>
                </md-card-header>
            </md-card>
        </draggable>
    </div>
</template>

<script>
export default {
    data() { 
        return {
            user: firebase.auth().currentUser,
            users: [],
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
            
            // save the user as a person that will be in the poll
            firebase.database().ref('users/'+ user.uid).set({
                name: user.displayName,
                photo: user.photoURL,
                email: user.email
            })
            .then(() => {
                // get users
                firebase.database().ref('users').once('value')
                    .then((snapshot) => {
                        let users = snapshot.val();
                        
                        if (this.rating.length) {
                            for (var index in this.rating) {
                                for (var key in users) {
                                    if (this.rating[index].user == key && this.user.uid != key) {
                                        users[key].key = key;
                                        this.users.push(users[key]);
                                    }
                                }
                            }
                        } else {
                            for (var key in users) {
                                if (this.user.uid != key) {
                                    users[key].key = key;
                                    this.users.push(users[key]);
                                }
                            }
                        }            
                    });
            });
                
            // bind ratings of firebase to rating
            this.$bindAsArray(
                'rating',
                firebase.database().ref('ratings/'+ user.uid)
            );
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
    padding: 30px 0;
    width: 600px;
    
    .md-card {
        margin-bottom: 5px;
        
        &.question {
            margin-bottom: 20px;
        }
    }
}
</style>
