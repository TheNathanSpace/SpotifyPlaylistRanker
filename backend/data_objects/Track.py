import util


class Track:
    def __init__(self, uri: str, name: str, album_uri: str, artist_uri: str, audio_preview_url: str):
        self.uri = uri
        self.name = name
        self.album_uri = album_uri
        self.artist_uri = artist_uri
        self.audio_preview_url = audio_preview_url

    def to_tuple(self) -> ():
        return (
            self.uri,
            self.name,
            self.album_uri,
            self.artist_uri,
            self.audio_preview_url
        )

    def __eq__(self, other):
        """Overrides the default implementation"""
        if isinstance(other, Track):
            return self.uri == other.uri
        return False
