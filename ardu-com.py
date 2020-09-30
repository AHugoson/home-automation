import serial

ser = serial.Serial('COM3')
print(ser.name)
ser.write('hej!')
ser.close()