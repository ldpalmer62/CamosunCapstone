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

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

#Connect to BME280 via SPI
spi = busio.SPI(board.GP10, board.GP11, board.GP12)
cs = digitalio.DigitalInOut(board.GP13)
bme280 = adafruit_bme280.Adafruit_BME280_SPI(spi, cs)
bme280.sea_level_pressure = 1009.4

#If the device has just been plugged in, send an extra post to the database
JustBooted = True

#API URL // To be changed to RaspberryPi IP or URL
url = "https://us-west-2.aws.data.mongodb-api.com/app/data-fvikqyr/endpoint/data/v1/action/"

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
    return(str(time.localtime().tm_year)+" "+str(time.localtime().tm_mon)+" "+str(time.localtime().tm_mday))

#Get the current Time in the format hh mm ss
def GetTime():
    return(str(time.localtime().tm_hour)+" "+str(time.localtime().tm_min)+" "+str(time.localtime().tm_sec))

#Get the current Date and Time in the format YYYY MM DD hh mm ss
def GetDateTime():
    return(GetDate()+" "+GetTime())

# Function to check if any data is out of bounds
def CheckMinMax(temp, humid):
    OutOfBounds = False
    if(humid > MAX_HUMID):
        OutOfBounds = true
    if(humid < MIN_HUMID):
        OutOfBounds = true
    if(temp > MAX_TEMP):
        OutOfBounds = true
    if(temp < MIN_TEMP):
        OutOfBounds = true
    return(OutOfBounds)


# Function to wait until next 10 minute increment
def WaitUntilNextTenMins():
    timeToSleep = (time.localtime().tm_min % 10) * 60
    timeToSleep += time.localtime().tm_sec
    print("Sleeping for " + str(600 - timeToSleep) + " seconds")
    time.sleep(600 - timeToSleep)

while True:
    
    #Connect to wifi
    print("Connecting to WiFi")
    
    #  connect to your SSID
    wifi.radio.connect(os.getenv('CIRCUITPY_WIFI_SSID'), os.getenv('CIRCUITPY_WIFI_PASSWORD'))
    pool = socketpool.SocketPool(wifi.radio)
    requests = adafruit_requests.Session(pool, ssl.create_default_context())
    WIFI = True
    
    print("Connected to WiFi")

    while WIFI: #If WIFI disconnects, it'll break out of this loop and reconnect automatically
        #Check if temp or humidity are out of safe bounds or if its time for the regular hourly post
        if(CheckMinMax(bme280.temperature, bme280.relative_humidity) or time.localtime().tm_min <= 10 or JustBooted):
            try:
                print("Posting data to database")
                
                #turn on LED to show that a post is being made
                led.value = True
                
                #Payload to send to endpoint // For now just Mongodb API
                payload = json.dumps({
                    "collection": "PICO",
                    "database": "Weather",
                    "dataSource": "Cluster0",
                    "document": {
                        "Temperature": bme280.temperature,
                        "Humidity": bme280.relative_humidity,
                        "Pressure": bme280.pressure,
                        "Altitude": bme280.altitude,
                        "DateTime": GetDateTime()
                    }
                })
                
                #Headers for endpoint 
                headers = {
                  'Content-Type': 'application/json',
                  'Access-Control-Request-Headers': '*',
                  'api-key': 'sBg2VErjv87Dz4zMP4fq8EbYeaxDNreb3eOwJnYH9WCWs37AF2ocbOox9oAwzJxF',
                }
                
                #Send post to database
                response = requests.request("POST", url + "insertOne", headers=headers, data=payload)
                
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
