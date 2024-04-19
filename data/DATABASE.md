# Database

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

| Name        | Type   |
|-------------|--------|
| ☆ `uri`     | `TEXT` |
| `name`      | `TEXT` |
| `album_uri` | `TEXT` |

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