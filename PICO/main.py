import os
import wifi
import socketpool
import time
import ssl
import microcontroller
import adafruit_requests
import json
import board
import busio
import digitalio
from adafruit_bme280 import basic as adafruit_bme280
import rtc
import Settings

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

#Connect to BME280 via SPI
spi = busio.SPI(board.GP10, board.GP11, board.GP12)
cs = digitalio.DigitalInOut(board.GP13)
bme280 = adafruit_bme280.Adafruit_BME280_SPI(spi, cs)
bme280.sea_level_pressure = 1009.4

#Set variable for RTC (Real Time Clock) 
r = rtc.RTC()

#If the device has just been plugged in, send an extra post to the database
JustBooted = True

global ID
ID = None


#API URL // To be changed to RaspberryPi IP or URL
url = Settings.URL

###---Units---###
#Pressure: hPa
#Humidity: # relitive humidity
#Temperature: celsius


#Set min and maximum boundary values for Temp and Humidity
MAX_TEMP = 30.0
MIN_TEMP = 10.0
MAX_HUMID = 50.0
MIN_HUMID = 0.0

#Get the current Date in the format YYYY MM DD
def GetDate():
    return(str(r.datetime.tm_year)+" "+str(r.datetime.tm_mon)+" "+str(r.datetime.tm_mday))

#Get the current Time in the format hh mm ss
def GetTime():
    return(str(r.datetime.tm_hour)+" "+str(r.datetime.tm_min)+" "+str(r.datetime.tm_sec))

#Get the current Date and Time in the format YYYY MM DD hh mm ss
def GetDateTime():
    return(GetDate()+" "+GetTime())

# Function to check if any data is out of bounds
def CheckMinMax(temp, humid):
    OutOfBounds = False
    if(humid > MAX_HUMID):
        OutOfBounds = True
    if(humid < MIN_HUMID):
        OutOfBounds = True
    if(temp > MAX_TEMP):
        OutOfBounds = True
    if(temp < MIN_TEMP):
        OutOfBounds = True
    return(OutOfBounds)


# Function to wait until next 10 minute increment
def WaitUntilNextTenMins():
    timeToSleep = (r.datetime.tm_min % 10) * 60
    timeToSleep += r.datetime.tm_sec
    print("Sleeping for " + str(600 - timeToSleep) + " seconds")
    time.sleep(600 - timeToSleep)
    
def GetNewID():
    try:
        payload = json.dumps({"name": Settings.NAME})
        headers = {'Content-Type': 'application/json'}
        response = requests.request("POST", url + "/register_sensor", data=payload, headers=headers)
        response_json = json.loads(response.text)
        id_value = response_json.get("sensor_id")  # Get the value for the key "sensor_id", or None if the key doesn't exist
        
        if id_value is not None:
            with open("ID.txt", 'w') as file:
                file.write(str(id_value))
            ID = str(id_value)
        else:
            print("Invalid response format: 'sensor_id' key not found in response JSON")
    except Exception as e:
        print("Error fetching new ID")
        print(e)


# Function to load an ID from a file
def LoadID():
    global ID
    try:
        with open("ID.txt", 'r') as file:
            if(not file.read().strip() == "0"):
                file.seek(0)
                ID = str(file.read())
                print(ID)
            else:
                ID = None
    except OSError:
        ID = None
    
def BuildWeatherPayload():
    return(
        json.dumps({
            "sensor_id": ID,
            "temperature": bme280.temperature,
            "humidity": bme280.relative_humidity,
            "pressure": bme280.pressure,
            "altitude": bme280.altitude,
            "important": CheckMinMax(bme280.temperature, bme280.relative_humidity)
        })
    )

while True:
    
    #Connect to wifi
    print("Connecting to WiFi")
    
    #  connect to your SSID
    wifi.radio.connect(os.getenv('CIRCUITPY_WIFI_SSID'), os.getenv('CIRCUITPY_WIFI_PASSWORD'))
    pool = socketpool.SocketPool(wifi.radio)
    requests = adafruit_requests.Session(pool, ssl.create_default_context())
    WIFI = True
    
    print("Connected to WiFi")
    
    #Get the current time from worldtimeAPI
    ### when using time.localtime() it would return jan 1 2020 whenever its ran on its own
    print("Getting Current Time")
    response = requests.request("GET", url + "/get_current_time")
    Time = json.loads(response.text)
    #print(response.text)
    #Set the time for the pi to use
    r.datetime = time.localtime(Time["datetime"])
    print(GetDate())
    
    LoadID()
    print("loaded id = " + str(ID))
    if not ID:
        GetNewID()
        
        
    while WIFI: #If WIFI disconnects, it'll break out of this loop and reconnect automatically
            
        #Check if temp or humidity are out of safe bounds or if its time for the regular hourly post
        if(CheckMinMax(bme280.temperature, bme280.relative_humidity) or time.localtime().tm_min < 10 or JustBooted):
            JustBooted = False
            try:
                print("Posting data to database")
                
                #turn on LED to show that a post is being made
                led.value = True
                
                
                #This section is for a mongoDB database
                
                #Payload to send to endpoint
                #payload = json.dumps({
                #    "collection": "PICO",
                #    "database": "Weather",
                #    "dataSource": "Cluster0",
                #    "document": {
                #        "Temperature": bme280.temperature,
                #        "Humidity": bme280.relative_humidity,
                #        "Pressure": bme280.pressure,
                #        "DateTime": GetDateTime(),
                #        "Important": CheckMinMax(bme280.temperature, bme280.relative_humidity)
                #    }
                #})
                
                #Headers for endpoint 
                headers = {
                  'Content-Type': 'application/json'
                }
                
                payload = BuildWeatherPayload()
                
                #Send post to database
                response = requests.request("POST", url + "/add_sensor_reading", data=payload, headers=headers)
                
                #For debugging if post was successful 
                print(response.text)
                
                #Wait a second to assure led doesn't blink too quick
                time.sleep(1)
                #Turn of LED to show idle state
                led.value = False
                
                #Wait until the next 10 minute increment
                WaitUntilNextTenMins()
                
            except Exception as e:
                print("Error has occured")
                print(e)
                # Strobe the LED to show error if not plugged into IDE
                for i in range(20):
                    led.value = True
                    time.sleep(0.1)
                    led.value = False
                    time.sleep(0.1)
                #Generally the main error will be wifi disconnecting, so try to reconnect
                WIFI = False
        else:
            #If no information is needed to post, wait until next 10 min increment
            print("No information needed to post")
            WaitUntilNextTenMins()
