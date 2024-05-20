class JoinedTrack:
    def __init__(self, track_uri: str, album_uri: str, artist_uri: str, track_name: str, album_name: str,
                 artist_name: str, deleted: bool):
        self.track_uri = track_uri
        self.album_uri = album_uri
        self.artist_uri = artist_uri
        self.track_name = track_name
        self.album_name = album_name
        self.artist_name = artist_name
        self.deleted = deleted

    def to_dict(self):
        return {
            "track_uri": self.track_uri,
            "album_uri": self.album_uri,
            "artist_uri": self.artist_uri,
            "track_name": self.track_name,
            "album_name": self.album_name,
            "artist_name": self.artist_name,
            "deleted": self.deleted
        }
