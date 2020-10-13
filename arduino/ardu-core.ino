#include <IRremote.h>
#include <RCSwitch.h>

// Max length of one serial command
#define INPUT_SIZE 30
// Pin for receiving IR signals
#define RECV_PIN 4

RCSwitch mySwitch = RCSwitch();
int sensor_pin = A0;
int sensor_value = 0;
// long last_data_millis = 0;
char input[INPUT_SIZE + 1];

IRrecv irrecv(RECV_PIN);
IRsend irsend;

decode_results results;

void setup() {
    Serial.begin(9600);
    irrecv.enableIRIn();
    mySwitch.enableTransmit(10);
    pinMode(13, OUTPUT);
}

void loop() {
    sensor_value = analogRead(sensor_pin);

    if (irrecv.decode(&results)) {
        if (results.value == REPEAT) {
            Serial.println("irRepeat");
        }
        else {
            Serial.print("ir,");

            if (results.decode_type == NEC) {
                Serial.print("NEC");
            }
            else if (results.decode_type == SONY) {
                Serial.print("SONY");
            }
            else if (results.decode_type == RC5) {
                Serial.print("RC5");
            }
            else if (results.decode_type == RC6) {
                Serial.print("RC6");
            }
            else {
                Serial.print("UNKNOWN");
            }
            Serial.print(",");
            Serial.print(results.value, HEX);
            Serial.print(",");
            Serial.println(results.bits);
        }
        
        irrecv.resume();
    }
    while (Serial.available() > 0) {
        // Receive the command
        byte size = Serial.readBytesUntil(';', input, INPUT_SIZE);

        // Put a 0 to end the string
        input[size] = 0;

        // Read first command
        char *command = strtok(input, ":");

        // Handle command
        if (strcmp(command, "on 1") == 0) {
            mySwitch.sendTriState("FFF00FFFFFFF");
        }
        else if (strcmp(command, "off 1") == 0) {
            mySwitch.sendTriState("FFF00FFFFFF0");
        }
        else if (strcmp(command, "on 2") == 0) {
            mySwitch.sendTriState("FFF0F0FFFFFF");
        }
        else if (strcmp(command, "off 2") == 0) {
            mySwitch.sendTriState("FFF0F0FFFFF0");
        }
        else if (strcmp(command, "on 3") == 0) {
            mySwitch.sendTriState("FFF0FF0FFFFF");
        }
        else if (strcmp(command, "off 3") == 0) {
            mySwitch.sendTriState("FFF0FF0FFFF0");
        }
        else if (strcmp(command, "sendIR") == 0) {
            // Read next argument
            command = strtok(NULL, ":");
            long code = (long)strtol(command, NULL, 16);

            // Read next argument
            command = strtok(NULL, ":");
            int codeLen = (int)strtol(command, NULL, 10);

            // Send the IR signal
            irsend.sendNEC(code, codeLen);

            // Restart receiver
            irrecv.enableIRIn();
        }
    }

    // if (millis() - last_data_millis > 1000)
    // {
    //     Serial.print("light,");
    //     Serial.println(sensor_value);
    //     last_data_millis = millis();
    // }
}
