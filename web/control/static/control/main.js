function openConnection() {
    if (typeof socket !== 'undefined') {
        if (socket.readyState != socket.CLOSED) {
            alert('Already connected/connecting..')
            return
        }
    }

    socket = new WebSocket('ws://' + window.location.host + ':8080');

    socket.addEventListener('open', function (event) {
        console.log('[CONNECTED] Connected to server: ' + socket.url);
        document.getElementsByTagName('h1')[0].style='color: cornflowerblue;'
    });
    
    socket.addEventListener('close', function (event){
        console.log('[CONNECTION CLOSED] The connection was closed: ' + socket.url)
        document.getElementsByTagName('h1')[0].style='color: salmon;'
    });

    socket.addEventListener('message', function (event) {
        console.log('[RECEIVED] Message from server ', event.data);
    });

    socket.onerror=function() {
        alert('Could not connect..\nIs the server running?');
    }
}

function closeConnection() {
    if (typeof socket !== 'undefined') {
        socket.close()
    }
    else {
        alert('No socket found..')
    }
}
function sendDirectCommand(cmd) {
    if (typeof socket !== 'undefined' && socket.readyState == socket.OPEN) {
        cmd = '{"direct-command":"' + cmd + '"}'
        socket.send(cmd);
        console.log('[SENT] Sent to server: ' + cmd);
    }
    else {
        alert('No active connection..')
    }
}