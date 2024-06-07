from Model.SensorReading import SensorReading
from Model.Sensor import Sensor


def create_tables() -> None:
    """
    This function is used to create the tables for each Entity in our Model.
    Make sure the database connection to the database is already established
    BEFORE calling this function
    :return: None
    """
    SensorReading.createTable(ifNotExists=True)
    Sensor.createTable(ifNotExists=True)
