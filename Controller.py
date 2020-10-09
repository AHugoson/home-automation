import time
import threading
import serial
import logging

class Arduino_Controller(threading.Thread):
    def __init__(self, log_level=logging.INFO):
        logging.basicConfig(level=log_level)
        threading.Thread.__init__(self, name='Arduino_Controller')
        self.port = 'COM3'
        self.message = ''
        self.close_connection = False
    
    def run(self):
        logging.info(f'{self.name} running...')
        with serial.Serial(self.port) as ser:
            while ser.isOpen():
                if self.message:
                    ser.write(self.message)
                    self.message = ''
                if ser.inWaiting():
                    read_str = ser.readline().decode()
                    logging.debug(read_str)
                if self.close_connection:
                    ser.close()
                time.sleep(0.01)
    
    def sendMessage(self, msg:str):
        self.message = msg.encode()

    def stop(self):
        """Close serial connection and stop thread"""
        self.close_connection = True
        time.sleep(1)
        self._stop()