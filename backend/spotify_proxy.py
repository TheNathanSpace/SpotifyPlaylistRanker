import os

import spotipy
from spotipy import SpotifyClientCredentials, Spotify

import util


class SpotifyProxy:
    def __init__(self):
        self.spotify: Spotify = None

    def login(self):
        client_id = os.environ["spotify_client_id"]
        token = os.environ["spotify_token"]
        self.spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=client_id,
                                                                             client_secret=token))

    def check_playlist(self, playlist_uri: str):
        try:
            response = self.spotify.playlist(playlist_id=playlist_uri, fields="name")
            # TODO: Can cache playlist info here?
            return True
        except:
            return False

    def get_playlist_data(self, playlist_uri: str):
        playlist = self.spotify.playlist(playlist_id=playlist_uri,
                                         fields="name,description,images,owner.uri,owner.display_name")
        if len(playlist["images"]) > 0:
            image_url = playlist["images"][0]["url"]
        else:
            image_url = None

        short_user_uri = util.to_short_uri(playlist["owner"]["uri"])
        user = self.spotify.user(user=short_user_uri)

        if len(user["images"]) > 0:
            user_image_url = user["images"][0]["url"]
        else:
            user_image_url = None

        return {
            "playlist_name": playlist["name"],
            "playlist_description": playlist["description"],
            "playlist_image": image_url,
            "profile_uri": short_user_uri,
            "profile_username": playlist["owner"]["display_name"],
            "profile_image": user_image_url
        }
