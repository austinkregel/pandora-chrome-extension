window.__Pandora = {
    artist: '',
    song: '',
};
window.__Library = {
    events: {
        nextSong: function () {
            $('.skipButton').click()
        },
        likeSong: function () {
            $('.thumbUpButton').click()
        },
        dislikeSong: function () {
            $('.thumbDownButton').click()
        },
        getStations: function () {
            var textNames = [];
            $('.stationListItem .stationNameText').each(function (i, e) {
                textNames.push(e.innerText);
            })
            __Pandora.stations = textNames;
        },
        pauseSong: function () {
            $('.pauseButton').click();
        },
        playSong: function () {
            $('.playButton').click()
        },
        selectStation: function (id) {
            $('.stationListItem .stationNameText')[parseInt(id)].click()
            console.log('changin to station ' + __Pandora.stations[id])
        },
        updatePandora: function () {
            window.__Pandora.artist = $('.nowplaying .playerBarArtist').text(),
            window.__Pandora.song = $('.nowplaying .playerBarSong').text()
            window.__Pandora.currentSongLiked = $('.thumbUpButton').hasClass('indicator')
            window.__Pandora.currentSongDisliked = $('.thumbDownButton').hasClass('indicator')
            window.__Pandora.is_paused = $('.pauseButton').css('display') == 'none'
            window.__Pandora.currentStation = $('.stationChangeSelector .textWithArrow').text();
            var textNames = [];
            $('.stationListItem .stationNameText').each(function (i, e) {
                textNames.push(e.innerText);
            })
            __Pandora.stations = textNames;
            window.parent.postMessage(__Pandora, '*');
        }
    },
    on: function (event, data) {
        let e = __Library.events[event];
        if (data !== undefined) {
            e(data)
        } else {
            e();
        }
        __Library.events.updatePandora()
    }
}


window.scopedQuery = $;

if ($('html').hasClass('flexbox')) {

    window.addEventListener('message', function (e) {
        var command = e.data
        if (command.startsWith('event:')) {
            __Library.on(command.substr(6))
        } else if (command.startsWith('station:')) {
            __Library.on('selectStation', command.substr(8))
        }
        console.log('[!]', e.data);
    }, false);

    // Dom observer to make sure we're only getting the songs when they change.
    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function (obj, callback) {
            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {childList: true, subtree: true});
            }
            else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();
    observeDOM(document.querySelector('.nowplaying'), function () {
        __Library.events.updatePandora();
    })
}