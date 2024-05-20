import util


class Album:
    def __init__(self, uri: str, name: str, album_image: bytes):
        self.uri = uri
        self.name = name
        self.album_image = album_image

    def to_tuple(self) -> ():
        return (
            self.uri,
            self.name,
            self.album_image
        )

    def __eq__(self, other):
        """Overrides the default implementation"""
        if isinstance(other, Album):
            return self.uri == other.uri
        return False
