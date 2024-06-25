import datetime
import requests
import dotenv
import constants


def get_current_local_time() -> float:
    return datetime.datetime.now().timestamp()
