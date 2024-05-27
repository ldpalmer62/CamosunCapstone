from flask import Flask
from Model.sensor_reading_entity import SensorReading
from sqlobject import connectionForURI, sqlhub
import constants
from Controller.sensor_readings_controller import add_sensor_reading
from Model.create_tables import create_tables

# Create a connection to the SQLite database
sqlite_connection = connectionForURI(constants.DATABASE_PATH)
sqlhub.processConnection = sqlite_connection

# Create the tables in the database
create_tables()

# Create the Flask instance, this will be used to create the api endpoints
app = Flask(__name__)

