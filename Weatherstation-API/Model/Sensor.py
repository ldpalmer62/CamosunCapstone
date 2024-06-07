from sqlobject import SQLObject, StringCol, DateTimeCol

class Sensor(SQLObject):
    name = StringCol(unique=True)
    last_active = DateTimeCol()
