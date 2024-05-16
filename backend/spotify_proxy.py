import os

import spotipy
from spotipy import SpotifyClientCredentials, Spotify


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
            response = self.spotify.playlist(playlist_id=playlist_uri)
            # TODO: Can cache playlist info here?
            return True
        except:
            return False
