import socket
import threading
import json
import logging

class TCP_Server(threading.Thread):
    def __init__(self, log_level=logging.INFO):
        logging.basicConfig(level=log_level)
        threading.Thread.__init__(self, name="Server", daemon=True)
        self._max_size = 1024
        self._port = 1337
        self._ip = '0.0.0.0'
        self._addr = (self._ip, self._port)
        self._format = 'utf-8'

    def handle_client(self, conn:socket.socket, addr):
        logging.info(f'[NEW CONNECTION] {addr} connected.')

        connected = True
        while connected:
            msg = conn.recv(self._max_size).decode(self._format)
            if msg:
                logging.info(f'[Client: {addr}] {msg}')
            else:
                logging.info(f'[DISCONNECTED] {addr} closed the connection.')
                connected = False

    def run(self):
        _socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _socket.bind(self._addr)
        _socket.listen()
        logging.info(f'[LISTENING] Server is listening on {self._addr}')
        while True:
            conn, addr = _socket.accept()
            t = threading.Thread(target=self.handle_client, args=(conn, addr), daemon=True)
            t.start()