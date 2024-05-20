import util


class Artist:
    def __init__(self, uri: str, name: str, artist_image: bytes):
        self.uri = uri
        self.name = name
        self.artist_image = artist_image

    def to_tuple(self) -> ():
        return (
            self.uri,
            self.name,
            self.artist_image
        )

    def __eq__(self, other):
        """Overrides the default implementation"""
        if isinstance(other, Artist):
            return self.uri == other.uri
        return False
