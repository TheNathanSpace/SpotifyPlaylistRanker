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

    def login(self, username: str, password: str):
        if not self.database.user_exists(username):
            self.create_user(username, password)
        return self.login_user(username, password)

    def create_user(self, username: str, password: str):
        user_salt, user_hash = self.hash_new_password(password)
        self.database.create_user(username, user_salt, user_hash)

    def login_user(self, username: str, password: str):
        user_salt, user_hash = self.database.get_user_password(username)
        is_correct = self.is_correct_password(user_salt, user_hash, password)
        return is_correct, "placeholder_token"
