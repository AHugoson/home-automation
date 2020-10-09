import time
from Controller import Arduino_Controller
from Server import TCP_Server


_controller = Arduino_Controller()
_controller.start()

_server = TCP_Server()
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