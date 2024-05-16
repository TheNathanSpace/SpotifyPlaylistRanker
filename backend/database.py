import sqlite3
import time
from pathlib import Path
from sqlite3 import Connection, Cursor

import util
from data_objects.Playlist import Playlist
from data_objects.User import User


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

    def get_playlist(self, playlist_uri: str) -> Playlist:
        with self.get_db_cursor() as cursor:
            result = cursor.execute("SELECT uri, name, image, description, owner_uri, expires FROM playlist WHERE uri = ?;",
                                    (playlist_uri,)).fetchall()
            if len(result) > 0:
                result = result[0]
                if time.time() >= result[5]:
                    return None
                else:
                    return Playlist(result[0], result[1], result[2], result[3], result[4])
            else:
                return None

    def get_user(self, user_uri: str) -> User:
        with self.get_db_cursor() as cursor:
            result = cursor.execute("SELECT uri, name, user_image, expires FROM user WHERE uri = ?;",
                                    (user_uri,)).fetchall()
            if len(result) > 0:
                result = result[0]
                if time.time() >= result[3]:
                    return None
                else:
                    return User(result[0], result[1], result[2])
            else:
                return None

    def insert_playlist_user(self, user: User, playlist: Playlist):
        with self.get_db_cursor() as cursor:
            cursor.execute("INSERT OR REPLACE INTO user VALUES (?, ?, ?, ?);", user.to_tuple())
            cursor.execute("INSERT OR REPLACE INTO playlist VALUES (?, ?, ?, ?, ?, ?);", playlist.to_tuple())
