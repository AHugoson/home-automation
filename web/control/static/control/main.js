function openConnection() {
    if (typeof ws !== 'undefined') {
        if (ws.readyState != ws.CLOSED) {
            alert('Already connected/connecting..')
            return
        }
    }

    ws = new WebSocket('ws://' + window.location.host + ':8080');

    ws.addEventListener('open', function (event) {
        console.log('[CONNECTED] Connected to server: ' + ws.url);
        document.getElementsByTagName('h1')[0].style='color: cornflowerblue;'
    });
    
    ws.addEventListener('close', function (event){
        console.log('[CONNECTION CLOSED] The connection was closed: ' + ws.url)
        document.getElementsByTagName('h1')[0].style='color: salmon;'
        setTimeout(function(){openConnection();}, 1000)
    });

    ws.addEventListener('message', function (event) {
        console.log('[RECEIVED] Message from server ', event.data);
    });

    ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

openConnection();

function closeConnection() {
    if (typeof ws !== 'undefined') {
        ws.close()
    }
    else {
        alert('No ws found..')
    }
}

function sendDirectCommand(cmd) {
    if (typeof ws !== 'undefined' && ws.readyState == ws.OPEN) {
        cmd = '{"direct-command":"' + cmd + '"}'
        ws.send(cmd);
        console.log('[SENT] Sent to server: ' + cmd);
    }
    else {
        alert('No active connection..')
    }
}