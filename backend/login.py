from typing import Tuple
import os
import hashlib
import hmac

from database import Database


# From https://stackoverflow.com/questions/9594125/salt-and-hash-a-password-in-python/56915300#56915300
# (it seemed legit)

class Login:
    def __init__(self, database: Database):
        self.database = database

    def hash_new_password(self, password: str) -> Tuple[bytes, bytes]:
        """
        Hash the provided password with a randomly-generated salt and return the
        salt and hash to store in the database.
        """
        salt = os.urandom(16)
        pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        return salt, pw_hash

    def is_correct_password(self, salt: bytes, pw_hash: bytes, password: str) -> bool:
        """
        Given a previously-stored salt and hash, and a password provided by a user
        trying to log in, check whether the password is correct.
        """
        return hmac.compare_digest(
            pw_hash,
            hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        )

    def create_user(self, username: str, password: str):
        user_salt, user_hash = self.hash_new_password(password)
        print(f"New salt / hash: {user_salt} / {user_hash}")
        self.database.create_user(username, user_salt, user_hash)
        return True

    def login_user(self, username: str, password: str):
        if not self.user_exists(username):
            return False, ""

        user_salt, user_hash = self.database.get_user_password(username)
        print(f"Stored salt / hash: {user_salt} / {user_hash}")

        is_correct = self.is_correct_password(user_salt, user_hash, password)
        print(f"is correct: {is_correct}")
        if is_correct:
            return True, "placeholder_token"
        else:
            return False, ""

    def user_exists(self, username: str):
        return self.database.user_exists(username)

    def validate_password(self, password: str):
        return len(password) >= 8
