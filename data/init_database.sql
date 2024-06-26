CREATE TABLE IF NOT EXISTS user
(
    uri        TEXT PRIMARY KEY,
    name       TEXT,
    user_image BLOB,
    expires    REAL
);

CREATE TABLE IF NOT EXISTS playlist
(
    uri         TEXT PRIMARY KEY,
    name        TEXT,
    image       BLOB,
    description TEXT,
    owner_uri   TEXT,
    expires     REAL,
    FOREIGN KEY (owner_uri) REFERENCES user (uri)
);

CREATE TABLE IF NOT EXISTS album
(
    uri         TEXT PRIMARY KEY,
    name        TEXT,
    album_image BLOB
);

CREATE TABLE IF NOT EXISTS artist
(
    uri          TEXT PRIMARY KEY,
    name         TEXT,
    artist_image BLOB
);

CREATE TABLE IF NOT EXISTS track
(
    uri               TEXT PRIMARY KEY,
    name              TEXT,
    album_uri         TEXT,
    artist_uri        TEXT,
    audio_preview_url TEXT,
    FOREIGN KEY (album_uri) REFERENCES album (uri),
    FOREIGN KEY (artist_uri) REFERENCES artist (uri)
);

CREATE TABLE IF NOT EXISTS user
(
    uri        TEXT PRIMARY KEY,
    name       TEXT,
    user_image BLOB,
    expires    REAL
);

CREATE TABLE IF NOT EXISTS playlist_track_xref
(
    playlist_uri TEXT,
    track_uri    TEXT,
    deleted      INTEGER,
    expires      REAL,
    PRIMARY KEY (playlist_uri, track_uri),
    FOREIGN KEY (playlist_uri) REFERENCES playlist (uri),
    FOREIGN KEY (track_uri) REFERENCES track (uri)
);

CREATE TABLE IF NOT EXISTS logins
(
    username TEXT PRIMARY KEY,
    salt     BLOB,
    hash     BLOB
);

CREATE TABLE IF NOT EXISTS scores
(
    username     TEXT,
    playlist_uri TEXT,
    track_uri    TEXT,
    elo          REAL,
    PRIMARY KEY (username, playlist_uri, track_uri),
    FOREIGN KEY (username) REFERENCES logins (username),
    FOREIGN KEY (playlist_uri) REFERENCES playlist (uri),
    FOREIGN KEY (track_uri) REFERENCES track (uri)
);

CREATE TABLE IF NOT EXISTS wins
(
    username     TEXT,
    playlist_uri TEXT,
    track_uri_0  TEXT,
    track_uri_1  TEXT,
    winner       INTEGER CHECK (winner IN (0, 1)),
    timestamp    REAL,
    PRIMARY KEY (username, playlist_uri, track_uri_0, track_uri_1, timestamp),
    FOREIGN KEY (username) REFERENCES logins (username),
    FOREIGN KEY (playlist_uri) REFERENCES playlist (uri),
    FOREIGN KEY (track_uri_0) REFERENCES track (uri),
    FOREIGN KEY (track_uri_1) REFERENCES track (uri)
);