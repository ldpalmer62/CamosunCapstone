## Weather Tracking/Web Project

* Program a Raspberry Pi as a web server to track temperature, humidity and barometric pressure over time and display the results obtained from a wi-fi enabled microcontroller with a sensor attached

### Equipment needed

* Raspberry Pi 3B+ or 4B
* ESP 32 or Raspberry Pi Pico W microcontroller
* BME 280 temperature/pressure/humidity sensor

### Suggested Implementation

* Python web framework running on the Raspberry Pi with sqlite database or similar � suggest Flask

* Wi-Fi enabled microcontroller to gather sensor information and send to the Raspberry Pi � suggest programming in MicroPython or Circuit Python

### Suggested Steps

* set up a web server running Flask web framework
* use an ESP32 or Raspberry Pi Pico microcontroller with a BME280 attached to record temperature, humidity and barometric pressure
* send results to Flask periodically (hourly)
* display results nicely on a web page served up from the Flask framework
* track over time using a database
* can have an option to select viewing the results as a list or a graph
