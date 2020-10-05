import time
from Controller import Arduino_Controller
import socket
import threading

class Server(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self, name="Server", daemon=True)
        self._header = 64
        self._port = 1337
        self._server_ip = '0.0.0.0'
        self._addr = (self._server_ip, self._port)
        self._format = 'utf-8'

    def handle_client(self, conn, addr):
        print(f'\n[NEW CONNECTION] {addr} connected.')

        connected = True
        while connected:
            msg_length = conn.recv(self._header).decode(self._format)
            msg_length = int(msg_length)
            msg = conn.recv(msg_length).decode(self._format)
            print(f'[{addr}] {msg}')

    def run(self):
        _socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _socket.bind(self._addr)
        _socket.listen()
        print(f'\n[LISTENING] Server is listening on {self._addr}')
        while True:
            conn, addr = _socket.accept()
            t = threading.Thread(target=self.handle_client, args=(conn, addr), daemon=True)
            t.start()

_controller = Arduino_Controller()
_controller.start()

_server = Server()
_server.start()

while True:
    try:
        _controller.sendMessage(input("Message:"))
    except KeyboardInterrupt:
        print('\n[KeyboardInterrupt] Closing connections and subprocesses.')
        _controller.stop()
        _server._stop()
        print('Bye')
        break
