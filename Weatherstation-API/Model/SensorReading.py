from sqlobject import SQLObject, FloatCol, DateTimeCol, BoolCol, ForeignKey
import datetime


""" This class represents the SensorReading entity, which
will be created as a table in the database. Each member variable
represents a column in the SensorReading table """
class SensorReading(SQLObject):
    sensor = ForeignKey('Sensor')
    temperature = FloatCol()
    humidity = FloatCol()
    pressure = FloatCol()
    altitude = FloatCol(default=None)  # `default=None` makes it optional
    date = DateTimeCol(default=lambda: datetime.datetime.now())
    important = BoolCol()