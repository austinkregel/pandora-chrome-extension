new Vue({
    el: '#app',
    data: {
        pandora: '',
    },
    computed: {
        currentIsLiked: function() {
            if(!this.pandora){return false}
            return this.pandora.currentSongLiked;
        },
        is_paused: function() {
            if(!this.pandora){return false}
            return this.pandora.is_paused
        }
    },
    methods: {
        broadcast(event) {
            chrome.runtime.sendMessage({pandora: {command:event}})
        },
        clickLike(){
            this.broadcast('event:likeSong')
        },
        clickNext() {
            this.broadcast('event:nextSong')
        },
        getStations() {
            this.broadcast('event:getStations')
        },
        clickDislike(){
            this.broadcast('event:dislikeSong')
        },
        clickPause() {
            this.broadcast('event:pauseSong')
        },
        clickPlay() {
            this.broadcast('event:playSong');
        }
    },
    mounted() {
        chrome.extension.onMessage.addListener((message, messageSender, sendResponse) => {
            if(message.pandora_to_client){
                this.pandora = message.pandora_to_client
            }
            console.log(message)
        });
        this.broadcast('event:getStations');
    }
})