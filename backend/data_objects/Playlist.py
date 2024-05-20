import util


class Playlist:
    def __init__(self, uri: str, name: str, image: bytes, description: str, owner_uri: str):
        self.uri = uri
        self.name = name
        self.image = image
        self.description = description
        self.owner_uri = owner_uri

    def to_tuple(self) -> ():
        return (
            self.uri,
            self.name,
            self.image,
            self.description,
            self.owner_uri,
            util.get_one_day_expr()
        )

    def __eq__(self, other):
        """Overrides the default implementation"""
        if isinstance(other, Playlist):
            return self.uri == other.uri
        return False
