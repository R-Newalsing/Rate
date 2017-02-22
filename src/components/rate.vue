<template>
    <div class="rate">
        <md-card
            class="question">
            <md-card-header>
                <div class="md-title">
                    Wie is de ideale schoonzoon?
                </div>
                <div class="md-subhead">
                    Rangschik je collega's met jouw nummer 1 bovenaan en de laatste onderaan
                </div>
            </md-card-header>
        </md-card>
        <md-card v-if="! show">
            <md-card-area>
                <md-card-content>
                    <md-progress md-indeterminate></md-progress>
                </md-card-content>
            </md-card-area>
        </md-card>
        <md-card v-if="!user && show">
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
            v-if="user && show">
            <md-card v-for="(u, index) in users">
                <md-card-header>
                    <md-avatar>
                        <img alt="People" :src="u.photo">
                    </md-avatar>
                    <div class="md-title">{{ u.name }}</div>
                    <div class="md-subhead">Schoonzoon nr. {{ index + 1 }}</div>
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
            show: false
        }
    },
    
    mounted() {
        var that = this;
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                that.saveUser(user);
            } else {
                that.show = true;
            }
        });
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
                        var users = snapshot.val();
                        
                        for (var index in this.rating) {
                            for (var key in users) {
                                if (this.rating[index].user == key && this.user.uid != key) {
                                    users[key].key = key;
                                    this.users.push(users[key]);
                                    delete users[key];
                                }
                            }
                        }
                        
                        for (var key in users) {
                            if (this.user.uid != key) {
                                users[key].key = key;
                                this.users.push(users[key]);
                            }
                        }
                        
                        this.show = true;
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
        flex-direction: row;
        
        &.question {
            margin-bottom: 20px;
        }
        
        .md-card-header {
            margin-bottom: 0;
            width: 100%;
            cursor: move;
        }
    }
}
</style>
