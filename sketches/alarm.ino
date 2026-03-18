#include <WiFiNINA.h>
#include <PubSubClient.h>

// iphone hotspot needs "Maximize Compatibility" enabled in hotspot settings
char ssid[] = "iphone";
char pass[] = "sedf-32!";

const char id[] = "arduino-uno-r2";
const char username[] = "board";
const char password[] = "alarmino";
const char broker[] = "172.20.10.2";
const char topic[] = "gas/state";
int port = 8883;

int count = 0;
const long interval = 5000; 
unsigned long previous = 0;

WiFiSSLClient wifiClient;
PubSubClient mqttClient(broker, port, wifiClient);

void wifiConnect() {
    int status = WiFi.begin(ssid, pass);
    
    while (status != WL_CONNECTED) {
        status = WiFi.begin(ssid, pass);  

        Serial.println("[log] retrying connection to wi-fi network");

        delay(5000);
    }

    Serial.println("[log] connected to wi-fi network");
}

void mqttConnect() {
    while (!mqttClient.connected()) {
        Serial.println("[log] attempting mqtt connection...");

        if (mqttClient.connect(id, username, password)) {
            Serial.println("[log] connected to mqtt broker");
        }

        else {
            Serial.print("[error] mqtt connection failed with code ");
            Serial.println(mqttClient.state());

            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(9600);

    while (!Serial && millis() < 5000) {
        ;
    }

    wifiConnect();
    mqttConnect();
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        wifiConnect();
    }

    if (!mqttClient.connected()) {
        mqttConnect();
    }

    mqttClient.loop();

    unsigned long current = millis();

    if (current - previous >= interval) {
        previous = current;

        int gasValue = analogRead(A0);
        char gasString[10];
        sprintf(gasString, "%d", gasValue);

        Serial.println("[log] publishing gasValue: ");
        Serial.println(gasValue);

        mqttClient.publish(topic, gasString);
    }
}
