import datetime
import requests
import dotenv
import constants


def get_current_local_time() -> datetime.datetime:
    timezone = dotenv.get_key(constants.DOTENV_FILE_PATH, "TIME_ZONE")

    res = requests.get(f'http://worldtimeapi.org/api/timezone/{timezone}').json()
    print(res)

    return datetime.datetime.fromisoformat(res.get('datetime'))
