import socket
import threading
import json
import logging

class TCP_Server(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self, name="Server", daemon=True)
        self._max_size = 1024
        self._port = 1337
        self._ip = '0.0.0.0'
        self._addr = (self._ip, self._port)
        self._format = 'utf-8'
        self._received = {}
        self._pending2send = {}

    def handleClient(self, conn:socket.socket, addr):
        logging.info(f'[NEW CONNECTION] {addr} connected.')

        connected = True
        while connected:
            _received = conn.recv(self._max_size).decode(self._format)
            _json = {}
            if _received:
                try:
                    _json = json.loads(_received)
                    self._received = _json
                    logging.debug(f'[Client: {addr}] {_json}')
                except json.JSONDecodeError:
                    logging.debug(f'[Client: {addr}] Received invalid data: {_received}')
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
            t = threading.Thread(target=self.handleClient, args=(conn, addr), name="Client: " + str(addr[0]), daemon=True)
            t.start()