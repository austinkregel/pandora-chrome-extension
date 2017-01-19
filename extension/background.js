/**
 * Get the contributions for the given user and parse the data.
 */
var is_created = false
function setupIframe() {
    if(!is_created) {
        var i = document.createElement('iframe');
        i.id = 'pandora-iframe';
        i.src = 'https://www.pandora.com';

        document.querySelector('body').appendChild(i)
        is_created = true;
    }
}

// Grab the username from github.
setupIframe();
window.__Pandora_Iframe = null;

window.addEventListener('message', function(e) {
    window.__Pandora_Iframe = {source: e.source, origin: e.origin};
    chrome.runtime.sendMessage({pandora_to_client: e.data})
}, false);
window.Pandora = {
    send: function (message) {
        __Pandora_Iframe.source.postMessage(message, __Pandora_Iframe.origin);
    },
    update: function () {
        Pandora.send('event:updatePandora');
    }
}
chrome.extension.onMessage.addListener(function(message, messageSender, sendResponse) {
    if(message.pandora){
        Pandora.send(message.pandora.command)
        console.log(message.pandora)
    }
});
