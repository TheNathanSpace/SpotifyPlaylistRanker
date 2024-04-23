import sqlite3
from pathlib import Path
from sqlite3 import Connection, Cursor

import util


class WithCursor:
    def __init__(self, database_path):
        self.database = database_path
        self.connection = None
        self.cursor = None

    def __enter__(self):
        self.connection = sqlite3.connect(self.database)
        self.cursor = self.connection.cursor()
        return self.cursor

    def __exit__(self, exc_type, exc_value, traceback):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.commit()
            self.connection.close()


class Database:
    def get_database_path(self) -> str:
        return (util.get_data_dir() / "database.db").as_posix()

    def read_init_script(self) -> str:
        script: Path = util.get_data_dir() / "init_database.sql"
        return script.read_text()

    def get_db_cursor(self):
        return WithCursor(self.get_database_path())

    def init_database(self):
        script = self.read_init_script()
        with self.get_db_cursor() as cursor:
            cursor.executescript(script)

    def user_exists(self, username: str):
        with self.get_db_cursor() as cursor:
            result = cursor.execute("SELECT username FROM logins WHERE username = ?;", (username,)).fetchall()
            if len(result) > 0:
                return True
            else:
                return False

    def create_user(self, username: str, salt: bytes, hash: bytes):
        with self.get_db_cursor() as cursor:
            cursor.execute("INSERT INTO logins VALUES (?, ?, ?);", (username, salt, hash,))

    def get_user_password(self, username: str):
        with self.get_db_cursor() as cursor:
            result = cursor.execute("SELECT salt, hash FROM logins WHERE username = ?;",
                                    (username,)).fetchone()
            return result

    def insert_user_token(self, username: str, token: str, expires_time: float):
        with self.get_db_cursor() as cursor:
            cursor.execute("INSERT INTO login_tokens VALUES (?, ?, ?);", (username, token, expires_time,))

    def get_token_expiration(self, username: str, token: str):
        with self.get_db_cursor() as cursor:
            results = cursor.execute("SELECT expires FROM login_tokens WHERE username = ? AND token = ?;",
                                     (username, token,)).fetchall()
            if len(results) > 0:
                return results[0][0]
            else:
                return None
