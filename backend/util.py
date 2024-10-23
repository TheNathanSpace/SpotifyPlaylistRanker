import base64
import re
import secrets
import string
import time
from pathlib import Path


def get_data_dir() -> Path:
    return Path("../data/")


def get_env_path() -> Path:
    return Path("../.env")


def to_full_playlist_uri(short: str) -> str:
    return "spotify:playlist:" + short


def to_short_uri(long: str) -> str:
    pattern = "spotify:(.*):(.*)"
    matched = re.match(pattern=pattern, string=long)
    if matched:
        return matched.group(2)


def get_one_day_expr() -> float:
    return time.time() + (24 * 60 * 60)


def image_bytes_to_b64(content: bytes) -> str:
    if not content:
        content = (get_data_dir() / "local_file.png").read_bytes()
    return base64.b64encode(content).decode('ASCII')
