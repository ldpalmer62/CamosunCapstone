import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = f'sqlite:///{os.path.join(BASE_DIR, "database.db")}'
