import sqlite3
import time
from pathlib import Path

import util
from data_objects.Album import Album
from data_objects.Artist import Artist
from data_objects.Playlist import Playlist
from data_objects.Track import Track
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
            result = cursor.execute(
                "SELECT uri, name, image, description, owner_uri, expires FROM playlist WHERE uri = ?;",
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

    def get_playlist_tracks(self, playlist_uri: str, username: str) -> [()]:
        with self.get_db_cursor() as cursor:
            # Check if there are expired tracks in this playlist
            expired_tracks = cursor.execute(
                "SELECT playlist_uri, track_uri, deleted, expires FROM playlist_track_xref WHERE playlist_uri = ? AND deleted = FALSE AND ? > expires;",
                (playlist_uri, time.time())).fetchall()
            if len(expired_tracks) > 0:
                return None

            # Check if there are no tracks in this playlist
            active_tracks = cursor.execute(
                "SELECT playlist_uri, track_uri, deleted, expires FROM playlist_track_xref WHERE playlist_uri = ? AND deleted = FALSE;",
                (playlist_uri,)).fetchall()
            if len(active_tracks) == 0:
                return None

            # If neither of the above are true, then return
            # the current tracks and all other necessary info
            current_tracks_query = """
            SELECT pt_x.track_uri, al.uri, ar.uri, t.name, al.name, ar.name, pt_x.deleted, scores.elo, al.album_image
            FROM 	playlist_track_xref pt_x
                    JOIN track t ON pt_x.track_uri = t.uri
                    LEFT JOIN album al ON al.uri = t.album_uri
                    LEFT JOIN artist ar ON ar.uri = t.artist_uri
                    JOIN scores ON scores.playlist_uri = ? AND scores.track_uri = t.uri AND username = ?
            WHERE pt_x.playlist_uri = ?;"""

            current_tracks = cursor.execute(current_tracks_query, (playlist_uri, username, playlist_uri)).fetchall()
            return current_tracks

    def insert_tracks(self, tracks: list[Track], albums: list[Album], artists: list[Artist]):
        with self.get_db_cursor() as cursor:
            cursor.executemany("INSERT OR REPLACE INTO album VALUES (?, ?, ?);",
                               [album.to_tuple() for album in albums])
            cursor.executemany("INSERT OR REPLACE INTO artist VALUES (?, ?, ?);",
                               [artist.to_tuple() for artist in artists])
            cursor.executemany("INSERT OR REPLACE INTO track VALUES (?, ?, ?, ?, ?);",
                               [track.to_tuple() for track in tracks])

    def link_playlist_tracks(self, playlist_uri: str, track_uris: list[str]):
        with self.get_db_cursor() as cursor:
            # First, set all tracks to deleted. Then, replace all
            # remaining tracks with updated value (not deleted).
            cursor.execute("UPDATE playlist_track_xref SET deleted = TRUE WHERE playlist_uri = ?;", (playlist_uri,))
            expires = util.get_one_day_expr()
            cursor.executemany("INSERT OR REPLACE INTO playlist_track_xref VALUES (?, ?, ?, ?);",
                               [(playlist_uri, track_uri, False, expires) for track_uri in track_uris])

    def set_new_ratings(self, playlist_uri: str, username: str):
        with self.get_db_cursor() as cursor:
            set_scores_query = """
            INSERT INTO scores
            SELECT ?, ?, track_uri, 1000
            FROM playlist_track_xref x
            WHERE x.playlist_uri = ? AND
                  (?, x.playlist_uri, x.track_uri) NOT IN
                    (SELECT username, playlist_uri, track_uri FROM scores);
            """
            cursor.execute(set_scores_query, (username, playlist_uri, playlist_uri, username))

    def get_random_options(self, playlist_uri: str):
        with self.get_db_cursor() as cursor:
            random_options_query = """
            SELECT al.uri, al.name, al.album_image, t.uri, t.name, ar.uri, ar.name, ar.artist_image, t.audio_preview_url
            FROM playlist_track_xref x
            JOIN track t ON t.uri = x.track_uri
            JOIN album al ON al.uri = t.album_uri
            JOIN artist ar ON ar.uri = t.artist_uri
            WHERE x.deleted = 0 AND x.playlist_uri = ?
            ORDER BY RANDOM() LIMIT 2;
            """
            results = cursor.execute(random_options_query, (playlist_uri,)).fetchall()
            return results

    def get_rating(self, playlist_uri: str, username: str, track_uri: str):
        with self.get_db_cursor() as cursor:
            rating_query = """
            SELECT elo
            FROM scores
            WHERE username = ? AND playlist_uri = ? and track_uri = ?;
            """
            results = cursor.execute(rating_query, (username, playlist_uri, track_uri)).fetchone()
            return results[0]

    def update_rating(self, playlist_uri: str, username: str, track_uri: str, new_rating: float):
        with self.get_db_cursor() as cursor:
            update_rating_query = """
            UPDATE scores
            SET elo = ?
            WHERE username = ? AND playlist_uri = ? AND track_uri = ?;
            """
            cursor.execute(update_rating_query, (new_rating, username, playlist_uri, track_uri)).fetchone()

    def insert_win(self, playlist_uri: str, username: str, track_a_uri: str, track_b_uri: str, winner: int,
                   timestamp: float):
        with self.get_db_cursor() as cursor:
            insert_win_query = """
            INSERT INTO wins
            VALUES (?, ?, ?, ?, ?, ?);
            """
            cursor.execute(insert_win_query,
                           (username, playlist_uri, track_a_uri, track_b_uri, winner, timestamp)).fetchone()

    def reset_rankings(self, playlist_uri: str, username: str):
        with self.get_db_cursor() as cursor:
            reset_rankings_query = """
            UPDATE scores
            SET elo = 1000
            WHERE username = ? AND playlist_uri = ?;
            """
            cursor.execute(reset_rankings_query, (username, playlist_uri))

            clear_wins_query = """
            DELETE FROM wins
            WHERE username = ? AND playlist_uri = ?;
            """
            cursor.execute(clear_wins_query, (username, playlist_uri))
