import math


class EloRatingSystem:
    def __init__(self, k_factor=32):
        self.k_factor = k_factor

    def expected_score(self, rating_a: float, rating_b: float):
        return 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))

    def update_ratings(self, rating_a: float, rating_b: float, a_wins: bool):
        expected_a = self.expected_score(rating_a, rating_b)
        expected_b = 1 - expected_a

        actual_a = int(a_wins)
        actual_b = int(not a_wins)

        new_rating_a = rating_a + self.k_factor * (actual_a - expected_a)
        new_rating_b = rating_b + self.k_factor * (actual_b - expected_b)

        return new_rating_a, new_rating_b
