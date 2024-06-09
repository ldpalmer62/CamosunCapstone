from sqlobject import SQLObject, StringCol, DateTimeCol
import datetime

class Sensor(SQLObject):
    name = StringCol(unique=True)
    last_active = DateTimeCol(default=datetime.datetime.now())
