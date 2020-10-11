import asyncio
import json
import logging
import time

import websockets

from Controller import Arduino_Controller
from Server import TCP_Server

logging.basicConfig(level=logging.INFO)

_controller = Arduino_Controller()
_controller.start()

_server = TCP_Server()
_server.start()

connected = set()
websocket_addr = ('0.0.0.0', 8080)

async def handleClient(websocket:websockets.WebSocketServerProtocol, path):
    _addr = websocket.remote_address
    logging.info(f'[NEW CONNECTION] {_addr} connected.')

    connected.add(websocket)
    try:
        async for _received in websocket:
            try:
                _json = json.loads(_received)
                logging.info(f'[Client: {_addr}] {_json}')
                if _json.__contains__("direct-command"):
                    _controller.sendMessage(_json.pop("direct-command"))
            except json.JSONDecodeError:
                logging.info(f'[Client: {_addr}] Received invalid data: {_received}')
    except websockets.ConnectionClosedError:
        logging.info(f'[CONNECTION CLOSED] {_addr} closed the connection.')
        connected.remove(websocket)

start_server = websockets.serve(handleClient, *websocket_addr)

asyncio.get_event_loop().run_until_complete(start_server)
logging.info(f'[LISTENING] WebSocket Server is listening on {websocket_addr}')
asyncio.get_event_loop().run_forever()

while True:
    if _server._received.__contains__("direct-command"):
        _controller.sendMessage(_server._received.pop("direct-command"))
    time.sleep(0.01)
