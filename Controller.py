import time
import threading
import serial

class Arduino_Controller(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self, name='Arduino_Controller')
        self.port = 'COM3'
        self.message = ''
        self.close_connection = False
    
    def run(self):
        print(f'{self.name} running...')
        with serial.Serial(self.port) as ser:
            while ser.isOpen():
                if self.message:
                    ser.write(self.message)
                    self.message = ''
                if ser.inWaiting():
                    read_str = ser.readline().decode()
                    # print(read_str, end='')
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