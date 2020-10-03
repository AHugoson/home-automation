import time
from Controller import Arduino_Controller

_controller = Arduino_Controller()
_controller.start()

while True:
    _controller.sendMessage(input("Message:"))

_controller.stop()