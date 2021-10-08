import asyncio
import json
import logging
import schedule
import time
import sqlite3

import websockets

from Controller import Arduino_Controller
from Server import TCP_Server

logging.basicConfig(level=logging.INFO)

_controller = Arduino_Controller()
_controller.start()

_server = TCP_Server()
_server.start()

db_conn = sqlite3.connect('web/db.sqlite3')
db_cursor = db_conn.cursor()

connected = set()
websocket_addr = ('0.0.0.0', 8080)

async def updateActiveAlarms():
    old_alarms = []
    while True:
        logging.debug("Fetching alarms from database")
        db_cursor.execute("SELECT name, time, days, command FROM control_alarm WHERE active=1")
        alarms = db_cursor.fetchall()
        if alarms != old_alarms:
            schedule.clear('alarm')
            logging.info("Alarms updated in database, creating new schedule...")
            for alarm in alarms:
                logging.info(f"[{alarm[0]}] will go off at [{alarm[1]}] at days:[{alarm[2]}] and execute [{alarm[3].split('&&')}]")
                scheduleAlarms(alarm[0], alarm[1], alarm[2], alarm[3].split('&&'), tag='alarm')
            old_alarms = alarms
            print(schedule.jobs)
        schedule.run_pending()
        await asyncio.sleep(1)

def scheduleAlarms(name:str, time:str, days:int, commands:list, tag=''):
    if days == 0:
        schedule.every().day.at(time).do(sendMessages, commands).tag(name, tag)

def sendMessages(commands:list):
    for cmd in commands:
        _controller.sendMessage(cmd)
        time.sleep(1)

async def handleCommandsTCP():
    while True:
        if _server._received.__contains__("direct-command"):
            _controller.sendMessage(_server._received.pop("direct-command"))
        await asyncio.sleep(0.01)

async def handleClient(websocket:websockets.WebSocketServerProtocol, path):
    _addr = websocket.remote_address
    logging.info(f'[NEW CONNECTION] {_addr[0]} connected.')
    connected.add(_addr[0])

    try:
        async for _received in websocket:
            try:
                _json = json.loads(_received)
                logging.info(f'[Client: {_addr[0]}] {_json}')

                if _json.__contains__("direct-command"):
                    _controller.sendMessage(_json.pop("direct-command"))

            except json.JSONDecodeError:
                logging.info(f'[Client: {_addr}] Received invalid data: {_received}')

    except websockets.ConnectionClosedError:
        logging.info(f'[CONNECTION CLOSED] {_addr} closed the connection.')
        connected.remove(_addr[0])
        logging.info(f'Active connections: {len(connected)}')

start_server = websockets.serve(handleClient, *websocket_addr)
# Add all coroutines to the event loop
loop = asyncio.get_event_loop()

loop.create_task(handleCommandsTCP())
loop.create_task(updateActiveAlarms())

loop.run_until_complete(start_server)
logging.info(f'[LISTENING] WebSocket Server is listening on {websocket_addr}')

asyncio.get_event_loop().run_forever()
