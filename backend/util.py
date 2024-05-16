import re
import secrets
import string
import time
from pathlib import Path


def get_data_dir() -> Path:
    return Path("../data/")


def generate_secure_string(length) -> str:
    alphabet = string.ascii_letters + string.digits + string.punctuation
    secure_string = ''.join(secrets.choice(alphabet) for _ in range(length))
    return secure_string


def get_env_path() -> Path:
    return Path(get_data_dir() / "secret.env")


def init_env():
    env_path = get_env_path()
    if not env_path.exists():
        env_path.touch()
        env_path.write_text(f"jwt_secret={generate_secure_string(128)}")
    return env_path


def to_full_playlist_uri(short: str) -> str:
    return "spotify:playlist:" + short


def to_short_uri(long: str) -> str:
    pattern = "spotify:(.*):(.*)"
    matched = re.match(pattern=pattern, string=long)
    if matched:
        return matched.group(2)


def get_one_day_expr() -> float:
    return time.time() + (24 * 60 * 60)
