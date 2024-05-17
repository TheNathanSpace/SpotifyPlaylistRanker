from dotenv import load_dotenv
from flask import Flask, request

from flask_cors import CORS

import util
from database import Database
from login import Login
from spotify_proxy import SpotifyProxy

load_dotenv(dotenv_path=util.init_env())

app = Flask(__name__)
cors = CORS(app)

DATABASE = Database()
DATABASE.init_database()

LOGIN = Login(DATABASE)

SPOTIFY = SpotifyProxy()
SPOTIFY.login()


@app.route('/check-playlist')
def checkPlaylist():
    playlist_uri = request.args.get('playlist_uri')
    valid = SPOTIFY.check_playlist(util.to_full_playlist_uri(playlist_uri))
    return {
        "playlist_uri": playlist_uri,
        "valid": valid
    }


@app.route('/playlist-data')
def playlistData():
    playlist_uri = request.args.get('playlist_uri')
    response = SPOTIFY.get_playlist_data(util.to_full_playlist_uri(playlist_uri))
    return response


@app.route('/validate-account')
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


@app.route('/create-account')
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


@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')

    is_correct, token = LOGIN.login_user(username, password)

    return {
        "valid": is_correct,
        "token": token
    }


if __name__ == '__main__':
    app.run()
