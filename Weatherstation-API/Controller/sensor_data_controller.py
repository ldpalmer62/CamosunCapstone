import datetime
from dateutil.relativedelta import relativedelta
import sqlobject.main
import json
from Model.SensorReading import SensorReading
from Model.Sensor import Sensor
from sqlobject import DESC
from sqlobject.sqlbuilder import SQLConstant, AND


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

    # Update the last_active value to the current time
    sensor.set(last_active=datetime.datetime.now())

    # Remove the sensor_id key from the sensor_data dict. This is so
    # we can pass it as kwargs, since SQLObject won't allow any keys that aren't a part of the entity
    sensor_data.pop('sensor_id')

    # If a custom date was supplied, then replace the date str with a datetime obj created from the string
    if sensor_data.get('date'):
        sensor_data['date'] = datetime.datetime.strptime(sensor_data.get('date'), '%m-%d-%Y %H:%M:%S')

    # Create an instance of SensorReading, and supply the sensor_data dict to it as kwargs
    # Creating this object will automatically add it to the database
    SensorReading(sensor=sensor, **sensor_data)


def get_latest_sensor_data(sensor_id):
    if not sensor_id:
        raise ValueError()

    # If the sensor is not found, then raise a LookupError
    try:
        Sensor.get(int(sensor_id))
    except sqlobject.main.SQLObjectNotFound:
        raise LookupError()

    query = SensorReading.select(SensorReading.q.sensorID == sensor_id, orderBy=DESC(SensorReading.q.date))

    if not query:
        return None

    sensor_reading = query[0]

    return {
        'temperature': sensor_reading.temperature,
        'humidity': sensor_reading.humidity,
        'pressure': sensor_reading.pressure,
        'altitude': sensor_reading.altitude,
        'date': sensor_reading.date
    }


def get_all_sensor_data_since_date(sensor_id, date: str):
    """
    Gets a list of sensor data records ever since a specified date.
    For example, if the start_date specified was 07-21-2024, then all
    the sensor data recorded since 07-21-2024 will be retrieved.
    Date must be in the format: MM-DD-YYYY
    """
    start_date = datetime.datetime.strptime(date, '%m-%d-%Y').date()

    # If the sensor is not found, then raise a LookupError
    try:
        Sensor.get(int(sensor_id))
    except sqlobject.main.SQLObjectNotFound:
        raise LookupError()

    sensor_data_records = list(SensorReading.select(SensorReading.q.sensorID == sensor_id,
                                                    orderBy=SensorReading.q.date))

    sensor_data_records = filter(lambda x: x.date.date() >= start_date, sensor_data_records)

    return list(map(lambda x: {
                            'temperature': x.temperature,
                            'humidity': x.humidity,
                            'pressure': x.pressure,
                            'altitude': x.altitude,
                            'date': x.date
                        }, sensor_data_records))


def delete_sensor_readings_by_date(**kwargs):
    if not kwargs.get('date'):
        raise ValueError('date must be supplied')

    try:
        date_filter = datetime.datetime.strptime(f'{kwargs.get("date")}', '%m-%d-%Y')
    except (ValueError, TypeError) as e:
        raise ValueError('date format is invalid')

    for x in filter(lambda x: date_filter.date() == x.date.date(), SensorReading.select()):
        SensorReading.delete(x.id)
