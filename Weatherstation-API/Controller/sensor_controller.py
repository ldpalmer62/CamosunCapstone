from Model.Sensor import Sensor
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
