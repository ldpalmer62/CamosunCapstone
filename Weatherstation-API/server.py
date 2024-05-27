from flask import Flask, request, jsonify
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


@app.post('/add_sensor_reading')
def add_sensor_reading_route():
    """ Endpoint to add a sensor reading to the database """
    try:
        add_sensor_reading(request.form.to_dict())
        return 201
    except (ValueError, TypeError) as e:
        # If this function raises either a ValueError or a TypeError, then
        # the data supplied in the request is invalid. So send back an error to the user
        return jsonify({
            'error': str(e)
        }), 400  # Return the error message and a 400 status code
