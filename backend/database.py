import sqlite3
from pathlib import Path
from sqlite3 import Connection, Cursor

import util


class Database:
    def __init__(self):
        self.connection: Connection = None

    def read_init_script(self) -> str:
        script: Path = util.get_data_dir() / "init_database.sql"
        return script.read_text()

    def get_db_connection(self) -> Connection:
        if not self.connection:
            self.connection = sqlite3.connect(util.get_data_dir() / "database.db")
        return self.connection

    def close_db_connection(self):
        self.get_db_connection().commit()
        self.get_db_connection().close()
        self.connection = None

    def get_db_cursor(self) -> Cursor:
        return self.get_db_connection().cursor()

    def init_database(self):
        script = self.read_init_script()
        cursor: Cursor = self.get_db_cursor()
        cursor.executescript(script)
        cursor.close()
