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
    owner_uri   TEXT REFERENCES user.user_image
);

CREATE TABLE IF NOT EXISTS track
(
    uri         TEXT PRIMARY KEY,
    name        TEXT,
    album_uri   TEXT,
    album_image BLOB,
);

CREATE TABLE IF NOT EXISTS artist
(
    uri          TEXT PRIMARY KEY,
    name         TEXT,
    artist_image BLOB,
);

CREATE TABLE IF NOT EXISTS user
(
    uri        TEXT PRIMARY KEY,
    name       TEXT,
    user_image BLOB,
);

CREATE TABLE IF NOT EXISTS playlist_track_xref
(
    playlist_uri TEXT REFERENCES playlist.uri,
    track_uri    TEXT REFERENCES track.uri,
    PRIMARY KEY (playlist_uri, track_uri)
);

CREATE TABLE IF NOT EXISTS track_artist_xref
(
    track_uri  TEXT REFERENCES track.uri,
    artist_uri TEXT REFERENCES artist.uri,
    PRIMARY KEY (track_uri, artist_uri)
);