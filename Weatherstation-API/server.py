from flask import Flask, request, jsonify, make_response
from sqlobject import connectionForURI, sqlhub
import constants
from Controller.sensor_data_controller import *
from Controller.sensor_controller import *
from Controller.get_current_local_time import get_current_local_time
from Model.create_tables import create_tables
from sqlobject.dberrors import DuplicateEntryError
from sqlobject.main import SQLObjectNotFound
from flask_cors import CORS

# Create a connection to the SQLite database
sqlite_connection = connectionForURI(constants.DATABASE_PATH)
sqlhub.processConnection = sqlite_connection

# Create the tables in the database
create_tables()

# Create the Flask instance, this will be used to create the api endpoints
app = Flask(__name__)
CORS(app)


@app.post('/add_sensor_reading')
def add_sensor_reading_route():
    """ Endpoint (route) to add a sensor reading to the database """
    try:
        add_sensor_reading(request.get_json())
        return {}, 201  # Return a 201 created response to the client
    except (ValueError, TypeError) as e:
        # If this function raises either a ValueError or a TypeError, then
        # the data supplied in the request is invalid. So send back an error to the user
        return jsonify({
            'error': str(e)
        }), 400  # Return the error message and a 400 status code
    except LookupError as e:
        return jsonify({
            'error': 'The corresponding sensor was not found in the database. Make sure your sensor_id value is correct'
        }), 403  # Return a 403 Forbidden response if the sensor is not found


@app.post('/register_sensor')
def register_sensor_route():
    """ Endpoint (route) to register a new sensor """
    try:
        return {
            'sensor_id': register_sensor(request.get_json())
        }, 201
    except (ValueError, TypeError) as e:
        # If this function raises either a ValueError or a TypeError, then
        # the data supplied in the request is invalid. So send back an error to the user
        return jsonify({
            'error': str(e)
        }), 400  # Return the error message and a 400 status code

    except DuplicateEntryError as e:
        return jsonify({
            'error': 'A sensor with the same name already exists'
        }), 409  # Return a 409 Conflict error code


@app.get('/get_current_time')
def get_current_time_route():
    """
    Endpoint (route) to retrieve the current local time,
    the datetime is sent in the response as a string in ISO format
    """
    return {
        'datetime': float(get_current_local_time())
    }, 200


@app.get('/get_latest_sensor_data')
def get_latest_sensor_data_route():
    try:
        return get_latest_sensor_data(request.args.get('id')), 200
    except ValueError as e:
        return {
            'error': str(e)
        }, 400
    except LookupError as e:
        return {
            'error': 'No sensor with the corresponding id is registered'
        }, 403


@app.get('/get_all_sensor_data_since_date')
def get_all_sensor_data_since_date_route():
    try:
        return {
            'sensor_data': get_all_sensor_data_since_date(request.args.get('id'), request.args.get('date'))
        }, 200
    except ValueError as e:
        return {
            'error': str(e)
        }, 400
    except LookupError as e:
        return {
            'error': 'No sensor with the corresponding id is registered'
        }, 403


@app.get('/get_all_sensors')
def get_all_sensors_route():
    return {
        'sensors': get_all_sensors()
    }, 200


@app.delete('/delete_sensor/<sensor_id>')
def delete_sensor_route(sensor_id):
    try:
        delete_sensor(sensor_id)
        return {}, 204
    except SQLObjectNotFound:
        return {}, 404


@app.delete('/delete_sensor_readings_by_date/<date>')
def delete_sensor_readings_by_date_route(date):
    try:
        delete_sensor_readings_by_date(date=date)
        return {}, 204
    except (ValueError, TypeError) as e:
        return str(e), 400
