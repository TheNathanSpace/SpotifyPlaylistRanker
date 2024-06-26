import util


class User:
    def __init__(self, uri: str, name: str, user_image: bytes):
        self.uri = uri
        self.name = name
        self.user_image = user_image

    def to_tuple(self) -> ():
        return (
            self.uri,
            self.name,
            self.user_image,
            util.get_one_day_expr()
        )

    def __eq__(self, other):
        """Overrides the default implementation"""
        if isinstance(other, User):
            return self.uri == other.uri
        return False
