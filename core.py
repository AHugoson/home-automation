import time
import logging
from Controller import Arduino_Controller
from Server import TCP_Server

logging.basicConfig(level=logging.INFO)

_controller = Arduino_Controller()
_controller.start()

_server = TCP_Server()
_server.start()

while True:
    if _server._received.__contains__("direct-command"):
        _controller.sendMessage(_server._received.pop("direct-command"))
    time.sleep(0.01)