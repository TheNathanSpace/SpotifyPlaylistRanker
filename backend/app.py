import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

import os

from dotenv import load_dotenv
from flask import Flask, request

from flask_cors import CORS

import util
from data_objects.JoinedTrack import JoinedTrack
from data_objects.RankingOption import RankingOption
from database import Database
from elo_rating import EloRatingSystem
from login import Login
from spotify_proxy import SpotifyProxy

load_dotenv(dotenv_path=util.get_env_path())

app = Flask(__name__)
cors = CORS(app)

DATABASE = Database()
DATABASE.init_database()

LOGIN = Login(DATABASE)

SPOTIFY = SpotifyProxy(DATABASE)
SPOTIFY.login()

ELO_SYSTEM = EloRatingSystem(DATABASE)


def check_token_and_playlist(args):
    token = args.get('token')
    username = None
    playlist_uri = None

    if token:
        username = LOGIN.check_user_token(token)
        if not username:
            return None, None, {
                "valid": False,
                "error": f"Invalid token {token}"
            }
    else:
        return None, None, {
            "valid": False,
            "error": f"Missing token"
        }

    playlist_uri = args.get('playlist_uri')
    if playlist_uri:
        playlist_valid = SPOTIFY.check_playlist(util.to_full_playlist_uri(playlist_uri))
        if not playlist_valid:
            return None, None, {
                "valid": False,
                "error": f"Invalid playlist {playlist_uri}"
            }
    else:
        return None, None, {
            "valid": False,
            "error": f"Missing playlist"
        }

    return username, playlist_uri, None


@app.route('/api/version')
def version():
    return "0.3"


@app.route('/api/validate-account')
def validate_account():
    username = request.args.get('username')
    password = request.args.get('password')

    username_valid = not LOGIN.user_exists(username)
    password_valid = LOGIN.validate_password(password)

    return {
        "username_valid": username_valid,
        "password_valid": password_valid,
        "username_error": "Username not available.",
        "password_error": "Password must be at least 8 characters long.",
    }


@app.route('/api/create-account')
def create_account():
    username = request.args.get('username')
    password = request.args.get('password')

    username_valid = not LOGIN.user_exists(username)
    password_valid = LOGIN.validate_password(password)
    if not username_valid or not password_valid:
        return {
            "username_valid": username_valid,
            "password_valid": password_valid,
            "username_error": "Username not available.",
            "password_error": "Password must be at least 8 characters long.",
            "account_created": False
        }

    created = LOGIN.create_user(username, password)

    return {
        "username_valid": username_valid,
        "password_valid": password_valid,
        "username_error": "",
        "password_error": "",
        "account_created": created
    }


@app.route('/api/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')

    is_correct, token = LOGIN.login_user(username, password)

    return {
        "valid": is_correct,
        "token": token
    }


@app.route('/api/check-playlist')
def checkPlaylist():
    playlist_uri = request.args.get('playlist_uri')
    valid = SPOTIFY.check_playlist(util.to_full_playlist_uri(playlist_uri))
    return {
        "valid": valid,
        "playlist_uri": playlist_uri
    }


@app.route('/api/playlist-data')
def playlistData():
    username, playlist_uri, error = check_token_and_playlist(request.args)
    if error:
        return error

    response = SPOTIFY.get_playlist_data(util.to_full_playlist_uri(playlist_uri))
    return response


@app.route('/api/playlist-tracks')
def playlistTracks():
    username, playlist_uri, error = check_token_and_playlist(request.args)
    if error:
        return error

    response = SPOTIFY.get_playlist_tracks(util.to_full_playlist_uri(playlist_uri), username)
    if response:
        return {
            "playlist_uri": playlist_uri,
            "playlist_tracks": [
                JoinedTrack(track[0], track[1], track[2], track[3], track[4], track[5], track[6], track[7],
                            track[8]).to_dict()
                for track in response
            ],
            "valid": True
        }
    else:
        return {
            "valid": False,
            "error": f"Unknown error"
        }


@app.route('/api/ranking-options')
def rankingOptions():
    username, playlist_uri, error = check_token_and_playlist(request.args)
    if error:
        return error

    response = SPOTIFY.get_ranking_options(util.to_full_playlist_uri(playlist_uri), username)
    if response:
        return {
            "playlist_uri": playlist_uri,
            "options": [
                RankingOption(track[0], track[1], track[2], track[3], track[4], track[5], track[6], track[7],
                              track[8]).to_dict()
                for track in response
            ],
            "valid": True
        }
    else:
        return {
            "playlist_uri": playlist_uri,
            "valid": False
        }


# TODO: fix these endpoints to use POST and stuff instead of all GET
@app.route('/api/submit-ranking')
def submitRanking():
    username, playlist_uri, error = check_token_and_playlist(request.args)
    if error:
        return error

    track_a_uri = request.args.get("track_a_uri")
    track_b_uri = request.args.get("track_b_uri")
    a_wins = request.args.get("a_wins")

    a_wins = a_wins == "true"

    ELO_SYSTEM.update_ratings(util.to_full_playlist_uri(playlist_uri), username, track_a_uri, track_b_uri, a_wins)
    return {
        "playlist_uri": playlist_uri,
        "valid": False
    }


@app.route('/api/reset-rankings')
def resetRankings():
    username, playlist_uri, error = check_token_and_playlist(request.args)
    if error:
        return error

    ELO_SYSTEM.reset_rankings(util.to_full_playlist_uri(playlist_uri), username)
    return {
        "playlist_uri": playlist_uri,
        "valid": False
    }


if __name__ == '__main__':
    port = os.environ["backend_port"]
    if not port:
        logging.error("Config value backend_port is blank. Set in .env. Exiting.")
        exit(-1)

    app.run(host="0.0.0.0", port=int(port))
