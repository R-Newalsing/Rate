<template>
    <div class="result">
        <div class="inner">
            <md-card v-if="!show">
                <md-card-area>
                    <md-card-content>
                        <md-progress md-indeterminate></md-progress>
                    </md-card-content>
                </md-card-area>
            </md-card>
            <md-list v-if="show">
                <md-list-item v-for="(u, index) in users">
                    <md-avatar>
                        <img :src="u.photo">
                    </md-avatar>
                    <span>{{ u.name }}</span>
                    <md-chip>{{ u.points }}</md-chip>
                    <md-divider></md-divider>
                </md-list-item>
            </md-list>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            show: false
        }
    },
    
    firebase () {
        return {
            results: db.ref('ratings'),
            users: db.ref('users')
        }
    },
    
    mounted () {
        // var that = this;
        
        this.$firebaseRefs.users.on('value', () => {
            this.sortUsers();
        });
    },
    
    methods: {
        sortUsers () {
            var that = this;
            
            this.users.map((user) => {
                user.points = that.results.reduce((points, choices) => {
                    return points + choices['.value'].reduce((point, choice, index) => {
                        if (choice.user == user['.key']) {
                            return point + (index + 1);
                        } else {
                            return point;
                        }
                    }, 0);
                }, 0);
            });
            
            this.users.sort((current, next) => {
                return current.points - next.points;
            });
            
            this.show = true;
        }
    }
}
</script>

<style lang="sass">
</style>
