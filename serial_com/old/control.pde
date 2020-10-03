import processing.serial.*;
Serial port;
int light = 0;
int currentMinute = minute();

void setup() {
  port = new Serial(this, Serial.list()[1], 9600);
}

void draw() {

  //receive values
  while (port.available() > 0) {
    String inString = port.readStringUntil(10);
    if (inString != null) {
      String[] inArray = trim(split(inString, ","));
      if (inArray[0].equals("light")) {
        light = int(inArray[1]);
        addLightValue(light);
      } else if (inArray[0].equals("ir")) {
        addReceivedIR(inArray[1], inArray[2], inArray[3]);
      } else if (inArray[0].equals("irRepeat")) {
        repeatLastIR();
      }
      print(inString);
    }
  }
  executeDirectCommands();

  //Check alarms once every minute
  if (minute() != currentMinute) {
    println("Time is now " + nf(hour(), 2) + ":" + nf(minute(), 2) + ". Checking alarms...");
    checkAlarmTimes();
    currentMinute = minute();
  }

  delay(100);
}

//Increase value of repetitions by one for the latest received code
void repeatLastIR() {
  JSONArray jsonArr = loadJSONArray("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/received.json");
  int arr_length = jsonArr.size()-1;
  JSONObject repeatedObject = jsonArr.getJSONObject(arr_length);
  repeatedObject.setInt("repeated", repeatedObject.getInt("repeated") + 1);
  jsonArr.setJSONObject(arr_length, repeatedObject);
  saveJSONArray(jsonArr, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/received.json");
}

//Append received ir code type,value,length and time to json file (<webdir>/resources/received.json)
void addReceivedIR(String type, String value, String bit_length) {
  JSONArray jsonArr = loadJSONArray("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/received.json");
  JSONObject receivedObject = new JSONObject();
  receivedObject.setString("type", type);
  receivedObject.setString("value", value);
  receivedObject.setString("length", bit_length);
  receivedObject.setInt("repeated", 0);
  receivedObject.setString("date", year() + "-" + nf(month(), 2) + "-" + nf(day(), 2));
  receivedObject.setString("time", nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2));
  jsonArr.append(receivedObject);
  saveJSONArray(jsonArr, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/received.json");
}

//Append light sensor reading with date and time to json file (<webdir>/resources/light.json)
void addLightValue(int reading) {
  JSONArray jsonArr = new JSONArray();
  
  //The data file might be empty, handle that exception
  try {
    jsonArr = loadJSONArray("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/light.json");
  } catch (Exception e) {
    println(e);
    println("Light array empty, creating new...");
  }
  JSONObject timeReading = new JSONObject();
  timeReading.setString("date", year() + "-" + nf(month(), 2) + "-" + nf(day(), 2));
  timeReading.setString("time", nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2));
  timeReading.setInt("value", reading);
  jsonArr.append(timeReading);
  if (jsonArr.size()>10) {
    jsonArr.remove(0);
  }
  saveJSONArray(jsonArr, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/light.json");
}

//Read json file, send stored commands to arduino and remove the sent commands
void executeDirectCommands() {
  JSONObject jsonObj = new JSONObject();
  
  //The data file might be empty, handle that exception
  try {
    jsonObj = loadJSONObject("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/data.json");
  } catch (Exception e) {
    println(e);
    println("JSON-data could not be loaded, using backup...");
    jsonObj = loadJSONObject("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/data.json.backup");
  }
  JSONArray cmds = jsonObj.getJSONArray("direct-commands");
  for (int i = 0; i < cmds.size(); i++) {
    port.write(cmds.getString(0));
    cmds.remove(0);
  }
  saveJSONObject(jsonObj, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/data.json");
}

//Checks if any alarm is set at the current time, if so execute that alarms content
void checkAlarmTimes() {
  JSONObject jsonObj = loadJSONObject("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/data.json");
  JSONArray alarms = jsonObj.getJSONArray("alarms");
  for (int i = 0; i < alarms.size(); i++) {
    JSONObject alarm = alarms.getJSONObject(i);
    if (alarm.getString("time").equals(nf(hour(), 2) + ":" + nf(minute(), 2))) {
      println("Alarm activated!");

      //Write message to the action log
      JSONArray jsonArr = loadJSONArray("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/actionlog.json");
      JSONObject actionObj = new JSONObject();
      actionObj.setString("time", nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2));
      actionObj.setString("action", "Alarm activated. UI is disabled");
      actionObj.setString("address", "[server]");
      jsonArr.append(actionObj);
      saveJSONArray(jsonArr, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/actionlog.json");

      //Execute commands
      JSONArray cmds = alarm.getJSONArray("content");
      for (int j = 0; j < cmds.size(); j++) {
        String[] cmd = split(cmds.getString(j), ' ');
        if (cmd[0].equals("delay")) {
          delay(int(cmd[1]));
        } else {
          port.write(join(cmd, ' '));
        }
      }
      //Write message to the action log
      jsonArr = loadJSONArray("C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/actionlog.json");
      actionObj = new JSONObject();
      actionObj.setString("time", nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2));
      actionObj.setString("action", "Alarm executed. UI is enabled");
      actionObj.setString("address", "[server]");
      jsonArr.append(actionObj);
      saveJSONArray(jsonArr, "C:/Users/AHugo/OneDrive/Dokument/www/Arduino/resources/actionlog.json");
    }
  }
}
