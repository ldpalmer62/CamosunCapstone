import datetime
from Model.SensorReading import SensorReading
from Model.Sensor import Sensor


def add_sensor_reading(sensor_data: dict) -> None:
    """
    This function takes in a dictionary that contains the sensor data to store in the database.
    If the values in sensor_data are valid, it will create a new record in the database table
    for the sensor readings.
    :param sensor_data: The sensor data to add to the database
    :return: None
    """
    # If no sensor_id value was supplied, raise a ValueError
    if not sensor_data.get('sensor_id'):
        raise ValueError('No value for sensor_id was provided')

    # Get the sensor that has the corresponding id
    sensor = Sensor.get(id=sensor_data.get("sensor_id"))

    # If the sensor is not found, then raise a LookupError
    if not sensor:
        raise LookupError

    # Remove the sensor_id key from the sensor_data dict. This is so
    # we can pass it as kwargs, since SQLObject won't allow any keys that aren't a part of the entity
    sensor_data.pop('sensor_id')

    # Convert the datetime string into a datetime object that's in the sensor_data dict.
    # This is because SensorReading's date column is a datetime object, so it won't accept a str being supplied
    sensor_data.update({
        'date': datetime.datetime.fromisoformat(sensor_data.get('date'))
    })

    # Create an instance of SensorReading, and supply the sensor_data dict to it as kwargs
    # Creating this object will automatically add it into the database
    SensorReading(sensor=sensor, **sensor_data)
