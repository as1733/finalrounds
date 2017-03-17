window.addEventListener('message', function(event) {
    if (event.data.type && ((event.data.type === 'SS_UI_REQUEST'))) {
        port.postMessage(event.data);
    }
}, false);