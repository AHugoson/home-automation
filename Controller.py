import time
import threading
import serial
import logging

class Arduino_Controller(threading.Thread):
    def __init__(self, port='COM3'):
        threading.Thread.__init__(self, name='Arduino_Controller')
        self._port = port
        self._message = ''
        self._close_connection = False
    
    def run(self):
        logging.info(f'{self.name} running...')
        with serial.Serial(self._port) as ser:
            while ser.isOpen():
                if self._message:
                    ser.write(self._message)
                    self._message = ''
                if ser.inWaiting():
                    read_str = ser.readline().decode()
                    logging.debug(read_str)
                if self._close_connection:
                    ser.close()
                time.sleep(0.01)
    
    def sendMessage(self, msg:str):
        self._message = msg.encode()

    def stop(self):
        """Close serial connection and stop thread"""
        self._close_connection = True
        time.sleep(1)
        self._stop()