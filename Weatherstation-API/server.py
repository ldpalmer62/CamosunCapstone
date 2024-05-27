from flask import Flask
from Model.sensor_reading_entity import SensorReading
from sqlobject import connectionForURI, sqlhub
import constants
from Controller.sensor_readings_controller import

# Create a connection to the SQLite database
sqlite_connection = connectionForURI(constants.DATABASE_PATH)
sqlhub.processConnection = sqlite_connection

# Create the SensorReading table
SensorReading.createTable()

# Create the Flask instance, this will be used to create the api endpoints
app = Flask(__name__)

