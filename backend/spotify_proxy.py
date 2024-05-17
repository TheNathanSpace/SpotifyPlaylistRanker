import os

import requests
import spotipy
from spotipy import SpotifyClientCredentials, Spotify

import util
from data_objects.Playlist import Playlist
from data_objects.User import User
from database import Database


class SpotifyProxy:
    def __init__(self, database: Database):
        self.spotify: Spotify = None
        self.database: Database = database

    def login(self):
        client_id = os.environ["spotify_client_id"]
        token = os.environ["spotify_token"]
        self.spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=client_id,
                                                                             client_secret=token))

    def check_playlist(self, playlist_uri: str):
        try:
            response = self.spotify.playlist(playlist_id=playlist_uri, fields="name")
            return True
        except:
            return False

    def get_user_data(self, user_uri: str):
        cached_user = self.database.get_user(user_uri)
        if not cached_user:
            user = self.spotify.user(user=user_uri)

            if len(user["images"]) > 0:
                user_image_url = user["images"][0]["url"]
            else:
                user_image_url = None
            user_image_blob = requests.get(user_image_url).content
            cached_user = User(user_uri, user["display_name"], user_image_blob)

        return cached_user

    def get_playlist_data(self, playlist_uri: str):
        cached_playlist = self.database.get_playlist(playlist_uri)
        cached_user = None
        if not cached_playlist:
            playlist = self.spotify.playlist(playlist_id=playlist_uri,
                                             fields="name,description,images,owner.uri,owner.display_name")
            if len(playlist["images"]) > 0:
                image_url = playlist["images"][0]["url"]
            else:
                image_url = None
            playlist_image_blob = requests.get(image_url).content

            short_user_uri = util.to_short_uri(playlist["owner"]["uri"])
            cached_user = self.get_user_data(short_user_uri)

            cached_playlist = Playlist(playlist_uri, playlist["name"], playlist_image_blob, playlist["description"],
                                       short_user_uri)
        else:
            cached_user = self.get_user_data(cached_playlist.owner_uri)

        self.database.insert_playlist(cached_user, cached_playlist)

        return {
            "playlist_name": cached_playlist.name,
            "playlist_description": cached_playlist.description,
            "playlist_image": cached_playlist.image,
            "profile_uri": cached_user.uri,
            "profile_username": cached_user.name,
            "profile_image": cached_user.user_image
        }
