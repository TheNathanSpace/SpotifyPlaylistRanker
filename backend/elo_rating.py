import math
import os
import time

import dotenv

import util
from database import Database


class EloRatingSystem:
    def __init__(self, database: Database, k_factor: int = None):
        self.database = database
        self.k_factor = os.environ["elo_k_factor"]
        if not self.k_factor:
            self.k_factor = 64
            dotenv.set_key(util.get_env_path(), "elo_k_factor", str(self.k_factor))

    def expected_score(self, rating_a: float, rating_b: float):
        return 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))

    def get_new_ratings(self, rating_a: float, rating_b: float, a_wins: bool) -> (float, float):
        expected_a = self.expected_score(rating_a, rating_b)
        expected_b = 1 - expected_a

        actual_a = int(a_wins)
        actual_b = int(not a_wins)

        new_rating_a = rating_a + self.k_factor * (actual_a - expected_a)
        new_rating_b = rating_b + self.k_factor * (actual_b - expected_b)

        return new_rating_a, new_rating_b

    def update_ratings(self, playlist_uri: str, username: str, track_a_uri: str, track_b_uri: str, a_wins: bool):
        rating_a = self.database.get_rating(playlist_uri, username, track_a_uri)
        rating_b = self.database.get_rating(playlist_uri, username, track_b_uri)

        new_rating_a, new_rating_b = self.get_new_ratings(rating_a, rating_b, a_wins)
        self.database.update_rating(playlist_uri, username, track_a_uri, new_rating_a)
        self.database.update_rating(playlist_uri, username, track_b_uri, new_rating_b)

        self.database.insert_win(playlist_uri, username, track_a_uri, track_b_uri, 0 if a_wins else 1, time.time())

    def reset_rankings(self, playlist_uri: str, username: str):
        self.database.reset_rankings(playlist_uri, username)
