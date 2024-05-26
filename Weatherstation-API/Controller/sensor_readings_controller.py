from Model.sensor_reading_entity import SensorReading


def add_sensor_reading(sensor_data: dict) -> None:
    """
    This function takes in a dictionary that contains the sensor data to store in the database.
    If the values in sensor_data are valid, it will create a new record in the database table
    for the sensor readings.
    :param sensor_data: The sensor data to add to the database
    :return: None
    """