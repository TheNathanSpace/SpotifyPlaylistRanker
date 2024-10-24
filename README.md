# Spotify Playlist Ranker

Web app for users to rank tracks in a given Spotify playlist, eventually producing a ranked list showing their favorite
tracks.

## Usage

1. Build the Docker image: Clone the repo and run `docker build -t spotify_ranker .` on the same level as
   the `Dockerfile`.
2. Create the `.env` configuration file (see below section).
3. Start the app with `docker compose up`.

`compose.yaml` has some network stuff that you probably want to remove because I set it up specifically for my server.

### `.env` Configuration File

Create a `.env` file on the same level as `compose.yaml` and set the required variables. This file will be
mounted into the Docker container

Required variables:

- `spotify_client_id`
- `spotify_token`
- `backend_port`

Optional variables:

- `jwt_secret_key` (128-byte key will be generated otherwise)
- `elo_k_factor` (default of `64` will be used otherwise)
- `REACT_APP_PORT` (default of `3000` will be used otherwise)

Example:

```properties
jwt_secret_key=alphanumeric_string
spotify_client_id=alphanumeric_string
spotify_token=alphanumeric_string
elo_k_factor=64
backend_port=5000
REACT_APP_PORT=3000
```

If you change `REACT_APP_PORT`, be sure to update `compose.yaml` to expose the new port!

<details><summary><h3 style="display:inline">Without Docker</h3></summary>

Maybe you're trying to do development or something. Anyway...

The program has the following structure:

```
SpotifyPlaylistRanker
├─backend/
├─data/
├─frontend/
└─README.md
```

The back-end uses resources in the `data` directory, so they must be on the same level (as they are by the repository
structure).

Install the back-end requirements from `backend/requirements.txt`. **From the `backend` directory** (there are relative
paths from the back-end app's working directory), start the back-end with `python app.py`.

From the `frontend` directory, install the front-end requirements with `npm install`. From the `frontend` directory,
start the front-end with `npm start`.

</details>

## Notes

### To-Do

* Add column for that one Reddit measurement
* Add button to undo last vote
* Reset mouse position to center after vote
* Add reset password form
* Add user home page with a list of their ranked playlists
    * Include option to completely delete a playlist
* Add user playlist rankings share link to share with friends :)))
* Proper logging (front- and back-end)

### Stack

Front-End: React web app using MUI Joy UI

Back-End: Python Flask app

Database: SQLite

The plan is to containerize both into a single Docker container for easy deployment.

### User Interface

The UI will be built in React with MUI Joy UI components.

Figma mockup:

- [Design](https://www.figma.com/file/YcANdKT3sy9axCBssIUqvo/Spotify-Playlist-Ranker?type=design&node-id=0-1&mode=design)
- [Live Preview](https://www.figma.com/proto/YcANdKT3sy9axCBssIUqvo/Spotify-Playlist-Ranker?type=design&node-id=2-2&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=2%3A2)

![UI Mockup](data/ui_mockup.png)

### Database

The database will be a single, local SQLite database with several tables.

### Resources

- [Tom Scott: 1,204,986 Votes Decided: What Is The Best Thing?](https://www.youtube.com/watch?v=ALy6e7GbDRQ)
- [How Not to Sort by Average Rating](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html)
- [Python implementation of above (StackOverflow)](https://stackoverflow.com/a/10029645/7492795)
- [MUI Joy UI](https://mui.com/joy-ui/getting-started/)
- [AG Grid (table library)](https://www.ag-grid.com/react-data-grid/getting-started/)

## License

All rights reserved to the maximum possible extent.