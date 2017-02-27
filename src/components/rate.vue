<template>
    <div class="rate">
        <div class="inner">
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
            :options="options"
            @update="saveRating"
            v-if="user && show">
            <md-card v-for="(u, index) in users">
                <md-card-header>
                    <div class="left">
                        <md-avatar>
                            <img alt="People" :src="u.photo">
                        </md-avatar>
                        <div class="md-title">{{ u.name }}</div>
                        <div class="md-subhead">Schoonzoon nr. {{ index + 1 }}</div>
                    </div>
                    <div class="right">
                        <md-icon
                            v-if="u.status"
                            style="color: purple">
                            fiber_manual_record
                        </md-icon>
                    </div>
                </md-card-header>
            </md-card>
        </draggable>
    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: firebase.auth().currentUser,
            users: [],
            show: false,
            options: {
                delay: (this.isTouchDevice() ? 400 : 0),
                animation: 100,
            }
        }
    },
    
    firebase () {
        return {
            people: db.ref('users')
        }
    },
    
    mounted() {
        var that = this;
        // bind ratings of firebase to rating
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                that.user = user;
                that.saveUser(user);
            } else {
                that.show = true;
            }
        });
    },
    
    methods: {
        login () {
            firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            );
        },
        
        saveUser () {
            var that = this;

            this.$bindAsArray(
                'rating',
                firebase.database().ref('ratings/'+ this.user.uid)
            )
            
            this.$bindAsArray(
                'status',
                firebase.database().ref('users/' + this.user.uid + '/status')
            )
            
            this.$firebaseRefs.status.set(true);
            this.$firebaseRefs.status.onDisconnect().set(false);

            this.$firebaseRefs.rating.on('value', () => {
                this.$firebaseRefs.people.on('value', (snapshot) => {
                    this.sort(snapshot.val());
                    this.show = true;
                });
            });
        },

        sort (users) {
            this.users.splice(0);
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
        },
        
        isTouchDevice () {
            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                return true
            }
            
            return false;
        }
    }
}
</script>

<style lang="scss">
.rate {
    > .md-card {
        .md-card-header {
            cursor: auto;
        }
    }
    
    .md-card {
        margin-bottom: 5px;
        cursor: pointer;
        
        &.question {
            margin-bottom: 20px;
        }
        
        .md-card-header {
            margin-bottom: 0;
        }
        
        .left {
            float: left;
            width: 90%;
        }
        
        .right {
            float: right;
            width: 10%;
            min-height: 40px;
            text-align: right;
            padding: 8px;
        }
    }
}
</style>
