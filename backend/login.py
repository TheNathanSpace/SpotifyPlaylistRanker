import time
import uuid
from typing import Tuple
import os
import hashlib
import hmac
import jwt
from dotenv import load_dotenv

import util
from database import Database


# From https://stackoverflow.com/questions/9594125/salt-and-hash-a-password-in-python/56915300#56915300
# (it seemed legit)

class Login:
    def __init__(self, database: Database):
        self.jwt_algo = "HS256"
        self.database = database
        load_dotenv(dotenv_path=(util.get_data_dir() / "secret.env"))
        self.jwt_secret_key = os.environ["jwt_secret_key"]

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
        self.database.create_user(username, user_salt, user_hash)
        return True

    def login_user(self, username: str, password: str):
        if not self.user_exists(username):
            return False, ""

        user_salt, user_hash = self.database.get_user_password(username)

        is_correct = self.is_correct_password(user_salt, user_hash, password)
        if is_correct:
            token = self.gen_user_token(username)
            return True, token
        else:
            return False, ""

    def user_exists(self, username: str):
        return self.database.user_exists(username)

    def validate_password(self, password: str):
        return len(password) >= 8

    def gen_user_token(self, username: str) -> str:
        expires_time = time.time() + (24 * 60 * 60)  # Token expires after 1 day
        encoded_jwt = jwt.encode(payload={"username": username, "exp": expires_time},
                                 key=self.jwt_secret_key,
                                 algorithm=self.jwt_algo)
        return encoded_jwt

    def check_user_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, self.jwt_secret_key, algorithms=[self.jwt_algo])
            return payload["username"]
        except:
            return None
