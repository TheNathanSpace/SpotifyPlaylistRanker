import base64
import os

import requests
import spotipy
from spotipy import SpotifyClientCredentials, Spotify

import util
from data_objects.Album import Album
from data_objects.Artist import Artist
from data_objects.Playlist import Playlist
from data_objects.Track import Track
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

    def get_first_image(self, item):
        if "images" not in item:
            return None

        if len(item["images"]) > 0:
            image_url = item["images"][0]["url"]
            image_bytes = requests.get(image_url).content
        else:
            image_bytes = None
        return image_bytes

    def get_user_data(self, user_uri: str):
        cached_user = self.database.get_user(user_uri)
        if not cached_user:
            print(f"User not cached: {user_uri}")
            user = self.spotify.user(user=util.to_short_uri(user_uri))
            user_image_bytes = self.get_first_image(user)
            cached_user = User(user_uri, user["display_name"], user_image_bytes)

        return cached_user

    def get_playlist_data(self, playlist_uri: str):
        cached_playlist = self.database.get_playlist(playlist_uri)
        cached_user = None
        if not cached_playlist:
            print(f"Playlist not cached: {playlist_uri}")
            playlist = self.spotify.playlist(playlist_id=playlist_uri,
                                             fields="name,description,images,owner.uri,owner.display_name")
            playlist_image_bytes = self.get_first_image(playlist)
            cached_user = self.get_user_data(playlist["owner"]["uri"])

            cached_playlist = Playlist(playlist_uri, playlist["name"], playlist_image_bytes, playlist["description"],
                                       playlist["owner"]["uri"])
        else:
            cached_user = self.get_user_data(cached_playlist.owner_uri)

        self.database.insert_playlist_user(cached_user, cached_playlist)

        return {
            "playlist_name": cached_playlist.name,
            "playlist_description": cached_playlist.description,
            "playlist_image": util.image_bytes_to_b64(cached_playlist.image),
            "profile_uri": cached_user.uri,
            "profile_username": cached_user.name,
            "profile_image": util.image_bytes_to_b64(cached_user.user_image)
        }

    def get_playlist_tracks(self, playlist_uri: str, username: str):
        cached_tracks = self.database.get_playlist_tracks(playlist_uri, username)
        if not cached_tracks:
            # 1. Get all playlist tracks from Spotify
            # 2. Create track, album, artist data objects with downloaded images
            # 3. Insert tracks, albums, and artists into their respective tables
            # 4. Link playlist/tracks in playlist_track_xref table
            # 5. Set Elo rating for all new tracks
            # 6. Return the current list of tracks

            print(f"Playlist tracks not cached: {playlist_uri}")
            results = self.spotify.playlist_items(playlist_id=playlist_uri,
                                                  fields="href,limit,next,offset,previous,total,items(is_local,track.album.uri,track.album.images,track.album.name,track.artists(uri,name,images),track.name,track.uri,track.preview_url)")
            tracks = results['items']
            while results['next']:
                results = self.spotify.next(results)
                tracks.extend(results['items'])

            """
            is_local
            track {
                name,
                uri,
                album {
                    uri,
                    images,
                    name
                }
                artists [
                    uri,
                    images,
                    name
                ]
            }
            """

            track_objects = {}
            album_objects = {}
            artist_objects = {}

            print("Start tracks")
            for track in tracks:
                track_data = track["track"]
                if track_data["uri"] in track_objects:
                    # If the track is already in the dict, then
                    # we assume the album and artist were added too.
                    continue

                if track["is_local"]:
                    # uri and name, at the very least, should be available. We'll add the static
                    # image when we realize the album is null when sending it to the front-end.
                    track_object = Track(track_data["uri"], track_data["name"], None, None, None)
                    track_objects[track_object.uri] = track_object
                else:
                    first_artist = track_data["artists"][0]

                    track_object = Track(track_data["uri"], track_data["name"], track_data["album"]["uri"],
                                         first_artist["uri"], track_data["preview_url"])
                    track_objects[track_object.uri] = track_object

                    # We don't want to download the same image multiple times, so check
                    # if it's already in the dict
                    if track_data["album"]["uri"] not in album_objects:
                        album_image_bytes = self.get_first_image(track_data["album"])
                        album_object = Album(track_data["album"]["uri"], track_data["album"]["name"],
                                             album_image_bytes)
                        album_objects[album_object.uri] = album_object

                    if first_artist["uri"] not in artist_objects:
                        artist_image_bytes = self.get_first_image(first_artist)
                        artist_object = Artist(first_artist["uri"], first_artist["name"],
                                               artist_image_bytes)
                        artist_objects[artist_object.uri] = artist_object
            print("End tracks")

            print("Start artists")
            artist_list = list(artist_objects.keys())
            current_index = 0
            artists_data = []
            max_artists = 50  # Spotify claims 100 but throws 400 - too many IDs error for >50
            while current_index < len(artist_list):
                response = self.spotify.artists(artist_list[current_index: current_index + max_artists])
                artists_data.extend(response["artists"])
                current_index += max_artists

            for data in artists_data:
                artist_uri = data["uri"]
                artist_image_bytes = self.get_first_image(data)
                artist_objects[artist_uri].artist_image = artist_image_bytes
            print("End artists")

            print("Start DB")
            self.database.insert_tracks(list(track_objects.values()),
                                        list(album_objects.values()),
                                        list(artist_objects.values()))
            self.database.link_playlist_tracks(playlist_uri, list(track_objects.keys()))
            self.database.set_new_ratings(playlist_uri, username)
            cached_tracks = self.database.get_playlist_tracks(playlist_uri, username)
            print("End DB")
        return cached_tracks

    def get_ranking_options(self, playlist_uri: str, username: str):
        options = self.database.get_random_options(playlist_uri)
        return list(options)
