CREATE TABLE IF NOT EXISTS user
(
    uri        TEXT PRIMARY KEY,
    name       TEXT,
    user_image BLOB
);

CREATE TABLE IF NOT EXISTS playlist
(
    uri         TEXT PRIMARY KEY,
    name        TEXT,
    image       BLOB,
    description TEXT,
    owner_uri   TEXT,
    FOREIGN KEY (owner_uri) REFERENCES user (uri)
);

CREATE TABLE IF NOT EXISTS album
(
    uri  TEXT PRIMARY KEY,
    name TEXT,
    album_image BLOB
);

CREATE TABLE IF NOT EXISTS track
(
    uri       TEXT PRIMARY KEY,
    name      TEXT,
    album_uri TEXT,
    FOREIGN KEY (album_uri) REFERENCES album (uri)
);

CREATE TABLE IF NOT EXISTS artist
(
    uri          TEXT PRIMARY KEY,
    name         TEXT,
    artist_image BLOB
);

CREATE TABLE IF NOT EXISTS user
(
    uri        TEXT PRIMARY KEY,
    name       TEXT,
    user_image BLOB
);

CREATE TABLE IF NOT EXISTS playlist_track_xref
(
    playlist_uri TEXT ,
    track_uri    TEXT ,
    PRIMARY KEY (playlist_uri, track_uri),
    FOREIGN KEY (playlist_uri) REFERENCES playlist (uri),
    FOREIGN KEY (track_uri) REFERENCES track (uri)
);

CREATE TABLE IF NOT EXISTS track_artist_xref
(
    track_uri  TEXT ,
    artist_uri TEXT ,
    PRIMARY KEY (track_uri, artist_uri),
    FOREIGN KEY (track_uri) REFERENCES track (uri),
    FOREIGN KEY (artist_uri) REFERENCES artist (uri)
);

CREATE TABLE IF NOT EXISTS logins
(
    username TEXT PRIMARY KEY,
    salt     BLOB,
    hash     BLOB
);

CREATE TABLE IF NOT EXISTS login_tokens (
    username TEXT,
    token TEXT,
    expires REAL,
    PRIMARY KEY (username, token),
    FOREIGN KEY (username) REFERENCES logins (username)
)