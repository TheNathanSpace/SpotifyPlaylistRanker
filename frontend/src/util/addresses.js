require('dotenv').config()

const BACKEND_ROOT = "http://127.0.0.1:" + process.env.backend_port;
const CHECK_PLAYLIST = BACKEND_ROOT + "/check-playlist"
const LOGIN = BACKEND_ROOT + "/login"
const VALIDATE_ACCOUNT = BACKEND_ROOT + "/validate-account"
const CREATE_ACCOUNT = BACKEND_ROOT + "/create-account"
const GET_PLAYLIST_DATA = BACKEND_ROOT + "/playlist-data"
const GET_PLAYLIST_TRACKS = BACKEND_ROOT + "/playlist-tracks"
const GET_RANKING_OPTIONS = BACKEND_ROOT + "/ranking-options"
const SUBMIT_RANKING = BACKEND_ROOT + "/submit-ranking"

const RESET_PLAYLIST_RANKINGS = BACKEND_ROOT + "/reset-rankings"

export {
    CHECK_PLAYLIST,
    LOGIN,
    VALIDATE_ACCOUNT,
    CREATE_ACCOUNT,
    GET_PLAYLIST_DATA,
    GET_PLAYLIST_TRACKS,
    GET_RANKING_OPTIONS,
    SUBMIT_RANKING,
    RESET_PLAYLIST_RANKINGS
}