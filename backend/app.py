from flask import Flask, request

from flask_cors import CORS

from database import Database
from login import Login

app = Flask(__name__)
cors = CORS(app)

DATABASE = Database()
DATABASE.init_database()

LOGIN = Login(DATABASE)


@app.route('/check-playlist')
def checkPlaylist():
    playlist_uri = request.args.get('playlist_uri')

    # TODO: Validate playlist with Spotify API

    return {
        "playlist_uri": playlist_uri,
        "valid": True
    }


@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    print(f"Username / password: {username} / {password}")

    # TODO: Validate login
    is_correct, token = LOGIN.login(username, password)

    return {
        "valid": is_correct,
        "token": token
    }


if __name__ == '__main__':
    app.run()
