const SPOTIFY_PLAYLIST_PATTERN = /.*spotify\.com\/playlist\/([^?]+)(.*)/;

const toShortURI = (longURI) => {
    const pattern = /spotify:(.*):(.*)/
    const matched = pattern.exec(longURI);
    if (matched) {
        return matched[2];
    }
    return "";
};

export {SPOTIFY_PLAYLIST_PATTERN, toShortURI}