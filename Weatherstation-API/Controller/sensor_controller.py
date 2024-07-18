from Model.Sensor import Sensor
from Model.SensorReading import SensorReading
import datetime


def register_sensor(sensor_device_values: dict) -> str:
    """
    This controller function takes in a dictionary containing
    the values needed to add a new Sensor to the database
    :param sensor_device_values: dict containing the values that are needed to create a new Sensor record
    :return: The id of the sensor that gets created
    """
    if not sensor_device_values:
        raise ValueError("No parameters supplied")

    # Add a new Sensor record into the database
    new_sensor = Sensor(name=sensor_device_values.get('name'), last_active=datetime.datetime.now())

    # Return the id of the sensor we just created
    return str(new_sensor.id)


def get_all_sensors():
    return list(map(lambda x: {
        'id': x.id,
        'name': x.name,
        'last_active': x.last_active
    }, Sensor.select()))


def delete_sensor(sensor_id):
    SensorReading.deleteMany(SensorReading.q.sensorID == sensor_id)  # Delete all SensorReadings that are related to it
    Sensor.delete(sensor_id)  # Delete the actual Sensor
