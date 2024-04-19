# Spotify Playlist Ranker

Web app for users to rank tracks in a given Spotify playlist, eventually producing a ranked list showing their favorite
tracks.

## Stack

Front-End: React web app using MUI Joy UI

Back-End: Python Flask app

Database: SQLite

The plan is to containerize both into a single Docker container for easy deployment.

## Database

(☆ denotes key)

### `playlist`

| Name          | Type   |
|---------------|--------|
| ☆ `uri`       | `TEXT` |
| `name`        | `TEXT` |
| `image`       | `BLOB` |
| `description` | `TEXT` |
| `owner_uri`   | `TEXT` |

### `track`

| Name          | Type   |
|---------------|--------|
| ☆ `uri`       | `TEXT` |
| `name`        | `TEXT` |
| `album_uri`   | `TEXT` |

### `album`

| Name          | Type   |
|---------------|--------|
| ☆ `uri`       | `TEXT` |
| `name`        | `TEXT` |
| `album_image` | `BLOB` |

### `artist`

| Name           | Type   |
|----------------|--------|
| ☆ `uri`        | `TEXT` |
| `name`         | `TEXT` |
| `artist_image` | `BLOB` |

### `user`

| Name         | Type   |
|--------------|--------|
| ☆ `uri`      | `TEXT` |
| `name`       | `TEXT` |
| `user_image` | `BLOB` |

### `playlist_track_xref`

| Name             | Type   |
|------------------|--------|
| ☆ `playlist_uri` | `TEXT` |
| ☆ `track_uri`    | `TEXT` |

### `track_artist_xref`

| Name           | Type   |
|----------------|--------|
| ☆ `track_uri`  | `TEXT` |
| ☆ `artist_uri` | `TEXT` |

## Resources

- [Tom Scott: 1,204,986 Votes Decided: What Is The Best Thing?](https://www.youtube.com/watch?v=ALy6e7GbDRQ)
- [How Not to Sort by Average Rating](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html)
- [Python implementation of above (StackOverflow)](https://stackoverflow.com/a/10029645/7492795)
- [MUI Joy UI](https://mui.com/joy-ui/getting-started/)
- [Password Hashing/Salting in Python (StackOverflow)](https://stackoverflow.com/a/56915300/7492795)
- [Python `hashlib` documentation](https://docs.python.org/3/library/hashlib.html)

## License

All rights reserved to the maximum possible extent.