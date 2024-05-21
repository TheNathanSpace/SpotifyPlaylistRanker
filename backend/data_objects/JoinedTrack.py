import util


class JoinedTrack:
    def __init__(self, track_uri: str, album_uri: str, artist_uri: str, track_name: str, album_name: str,
                 artist_name: str, deleted: bool, elo: float, album_image: bytes):
        self.track_uri = track_uri
        self.album_uri = album_uri
        self.artist_uri = artist_uri
        self.track_name = track_name
        self.album_name = album_name
        self.artist_name = artist_name
        self.deleted = deleted
        self.elo = elo
        self.album_image = album_image

    def to_dict(self):
        return {
            "track_uri": self.track_uri,
            "album_uri": self.album_uri,
            "artist_uri": self.artist_uri,
            "track_name": self.track_name,
            "album_name": self.album_name,
            "artist_name": self.artist_name,
            "deleted": self.deleted,
            "elo": self.elo,
            "album_image": util.image_bytes_to_b64(self.album_image)
        }
