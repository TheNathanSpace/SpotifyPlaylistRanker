import util


class RankingOption:
    def __init__(self, album_uri: str, album_name: str, album_image: bytes, track_uri: str, track_name: str,
                 artist_uri: str, artist_name: str, artist_image: bytes, audio_preview_url: str):
        self.album_uri = album_uri
        self.album_name = album_name
        self.album_image = album_image

        self.track_uri = track_uri
        self.track_name = track_name
        self.audio_preview_url = audio_preview_url

        self.artist_uri = artist_uri
        self.artist_name = artist_name
        self.artist_image = artist_image

    def to_dict(self):
        return {
            "album_uri": self.album_uri,
            "album_name": self.album_name,
            "album_image_b64": util.image_bytes_to_b64(self.album_image),
            "track_uri": self.track_uri,
            "track_name": self.track_name,
            "audio_preview_url": self.audio_preview_url,
            "artist_uri": self.artist_uri,
            "artist_name": self.artist_name,
            "artist_image_b64": util.image_bytes_to_b64(self.artist_image),
        }
