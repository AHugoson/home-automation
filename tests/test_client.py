import socket

SERVER_ADDR = ('localhost', 8989)

_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

print(f'[CONNECTING] Client is trying to connect to {SERVER_ADDR}')
_socket.connect(SERVER_ADDR)

while True:
    try:
        _socket.sendall(input('Message:').encode('utf-8'))
    except KeyboardInterrupt:
        _socket.close()
        break
