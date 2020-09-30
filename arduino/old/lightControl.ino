#include <IRremote.h>
#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();
int sensorPin = A0;
int RECV_PIN = 4;
int sensorValue = 0;
long lastDataMillis = 0;
String receivedString1 = "";
String receivedString2 = "";
String receivedString3 = "";
String receivedString4 = "";

IRrecv irrecv(RECV_PIN);
IRsend irsend;

decode_results results;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(50);
//  Serial.println("Enabling IR receiver");
  irrecv.enableIRIn(); // Start the receiver
//  Serial.println("Enabled IR receiver (digital pin 4)");
//  Serial.println("Enabling RF transmitter");
  mySwitch.enableTransmit(10);
//  Serial.println("Enabled RF transmitter (digital pin 10)");
  pinMode(13, OUTPUT);
}

void loop() {
  sensorValue = analogRead(sensorPin);
  
  if (irrecv.decode(&results)) {
    if (results.value == REPEAT) {
      Serial.println("irRepeat");
    } else {
      Serial.print("ir,");
      if (results.decode_type == NEC) {
        Serial.print("NEC");
      } else if (results.decode_type == SONY) {
        Serial.print("SONY");
      } else if (results.decode_type == RC5) {
        Serial.print("RC5");
      } else if (results.decode_type == RC6) {
        Serial.print("RC6");
      } else {
        Serial.print("UNKNOWN");
      }
      Serial.print(",");
      Serial.print(results.value, HEX);
      Serial.print(",");
      Serial.println(results.bits);
    }
    irrecv.resume(); // Receive the next value
  }
  
  while (Serial.available() > 0) {
    receivedString1 = Serial.readStringUntil(',');
    Serial.read();
    receivedString2 = Serial.readStringUntil(',');
    Serial.read();
    receivedString3 = Serial.readStringUntil(',');
    Serial.read();
    receivedString4 = Serial.readString();
    Serial.print("received,[");
    Serial.print(receivedString1);
    Serial.print(',');
    Serial.print(receivedString2);
    Serial.print(',');
    Serial.print(receivedString3);
    Serial.print(',');
    Serial.print(receivedString4);
    Serial.println(']');
    if (receivedString1 == "on 1") {
      mySwitch.sendTriState("FFF00FFFFFFF");
    } else if (receivedString1 == "off 1") {
      mySwitch.sendTriState("FFF00FFFFFF0");
    } else if (receivedString1 == "on 2") {
      mySwitch.sendTriState("FFF0F0FFFFFF");
    } else if (receivedString1 == "off 2") {
      mySwitch.sendTriState("FFF0F0FFFFF0");
    } else if (receivedString1 == "on 3") {
      mySwitch.sendTriState("FFF0FF0FFFFF");
    } else if (receivedString1 == "off 3") {
      mySwitch.sendTriState("FFF0FF0FFFF0");
    } else if (receivedString1 == "on 4") {
      mySwitch.sendTriState("FFF0FFF0FFFF");
    } else if (receivedString1 == "off 4") {
      mySwitch.sendTriState("FFF0FFF0FFF0");
    } else if (receivedString1 == "sendIR") {
      long code = (long)strtol(&(receivedString3[0]), NULL, 16);
      int codeLen = (int)strtol(&(receivedString4[0]), NULL, 10);
      if (receivedString2 == "NEC") {
        irsend.sendNEC(code,codeLen);
      } else if (receivedString2 == "Sony") {
        for (int i = 0; i < 3; i++) {
          irsend.sendSony(code,codeLen);
          delay(40);
        }
      }
      irrecv.enableIRIn(); // Restart the receiver
    }
  }
  
  if (millis() - lastDataMillis > 1000) {
    Serial.print("light,");
    Serial.println(sensorValue);
    lastDataMillis = millis();
  }
}
